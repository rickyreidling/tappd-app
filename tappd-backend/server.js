const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://tappd-user:Tiger143!@tappd.odjek3u.mongodb.net/tappd?retryWrites=true&w=majority&appName=Tappd')
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Basic routes - NO EXTERNAL ROUTE FILES
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

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test user registration endpoint
app.post('/api/auth/register', (req, res) => {
  res.json({
    message: 'Registration endpoint working!',
    received: req.body,
    timestamp: new Date().toISOString()
  });
});

const PORT = 5003;
app.listen(PORT, () => {
  console.log(`🌈 Tappd server running on port ${PORT}`);
  console.log(`📱 Visit: http://localhost:${PORT}`);
  console.log('🔌 Ready for testing!');
});
// Test login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // For now, just simulate successful login
  if (email && password) {
    res.json({
      message: 'Login successful!',
      user: {
        id: '123',
        name: 'Test User',
        email: email,
        orientation: 'Gay'
      },
      token: 'fake-jwt-token-for-testing',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(400).json({
      message: 'Email and password required'
    });
  }
});