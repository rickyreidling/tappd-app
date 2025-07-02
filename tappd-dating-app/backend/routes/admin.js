const express = require('express');
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// Admin dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const pendingUsers = await User.countDocuments({ status: 'pending_review' });
    const premiumUsers = await User.countDocuments({ 'subscription.type': 'premium' });
    const reportedUsers = await User.countDocuments({ 'reports.0': { $exists: true } });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });

    res.json({
      totalUsers,
      activeUsers,
      pendingUsers,
      premiumUsers,
      reportedUsers,
      newUsersToday
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users with pagination
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { 'profile.name': { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('email profile status subscription reports createdAt lastSeen')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user status
router.put('/users/:userId/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status },
      { new: true }
    );

    res.json({ message: 'User status updated', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Grant premium access
router.put('/users/:userId/premium', adminAuth, async (req, res) => {
  try {
    const { duration } = req.body; // duration in days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + duration);

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { 
        'subscription.type': 'premium',
        'subscription.expiresAt': expiresAt
      },
      { new: true }
    );

    res.json({ message: 'Premium access granted', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reported users
router.get('/reports', adminAuth, async (req, res) => {
  try {
    const reportedUsers = await User.find({ 'reports.0': { $exists: true } })
      .populate('reports.reportedBy', 'profile.name email')
      .select('profile reports status')
      .sort({ 'reports.createdAt': -1 });

    res.json(reportedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/users/:userId', adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;