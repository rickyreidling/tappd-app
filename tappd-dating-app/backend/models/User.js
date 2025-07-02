const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    bio: { type: String, maxlength: 500 },
    photos: [{ type: String }],
    orientation: { 
      type: String, 
      enum: ['Gay', 'Bi', 'Pan', 'Queer', 'Questioning'],
      required: true 
    },
    tribe: { 
      type: String, 
      enum: ['Twink', 'Bear', 'Otter', 'Daddy', 'Jock', 'Leather', 'Other'],
    },
    location: {
      city: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    interests: [String],
    lookingFor: {
      type: String,
      enum: ['Relationship', 'Dates', 'Friends', 'Networking', 'Chat'],
      default: 'Dates'
    }
  },
  settings: {
    isVisible: { type: Boolean, default: true },
    showDistance: { type: Boolean, default: true },
    ageRange: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 99 }
    },
    maxDistance: { type: Number, default: 50 }
  },
  subscription: {
    type: { type: String, enum: ['free', 'premium'], default: 'free' },
    expiresAt: Date
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'pending_review', 'banned'],
    default: 'pending_review'
  },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  reports: [{
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    createdAt: { type: Date, default: Date.now }
  }],
  matches: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    matchedAt: { type: Date, default: Date.now }
  }],
  swipes: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    direction: { type: String, enum: ['left', 'right'] },
    swipedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);