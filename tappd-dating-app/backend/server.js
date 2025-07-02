const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Connect to MongoDB - HARDCODED TO WORK
mongoose.connect('mongodb+srv://tappd-user:Tiger143!@tappd.odjek3u.mongodb.net/tappd?retryWrites=true&w=majority&appName=Tappd', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Basic test route
app.get('/', (req, res) => {
  res.json({ 
    message: '🌈 Tappd API is running!', 
    status: 'OK',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth (register, login, logout)',
      users: '/api/users (discover, profile, swipe, matches)',
      admin: '/api/admin (dashboard, user management)'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Import and use routes - ONLY ONCE
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io for real-time messaging
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  socket.on('user-online', (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('send-message', (data) => {
    const { recipientId, senderId, message } = data;
    
    // Send to recipient if they're online
    if (connectedUsers.has(recipientId)) {
      io.to(recipientId).emit('receive-message', {
        senderId,
        message,
        timestamp: new Date()
      });
    }
    
    // Also send back to sender for confirmation
    socket.emit('message-sent', {
      recipientId,
      message,
      timestamp: new Date()
    });
  });

  socket.on('typing', (data) => {
    const { recipientId, isTyping } = data;
    if (connectedUsers.has(recipientId)) {
      io.to(recipientId).emit('user-typing', {
        senderId: data.senderId,
        isTyping
      });
    }
  });

  socket.on('disconnect', () => {
    // Remove user from connected users map
    for (let [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
    console.log('👤 User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = 5003;
server.listen(PORT, () => {
  console.log(`🌈 Tappd server running on port ${PORT}`);
  console.log(`📱 Visit: http://localhost:${PORT}`);
  console.log(`🔌 Socket.io ready for real-time connections`);
});