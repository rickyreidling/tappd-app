const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get discover users (for swiping)
router.get('/discover', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    const { page = 1, limit = 10 } = req.query;
    
    // Get users the current user hasn't swiped on
    const swipedUserIds = currentUser.swipes.map(swipe => swipe.userId);
    swipedUserIds.push(currentUser._id); // Exclude self

    const users = await User.find({
      _id: { $nin: swipedUserIds },
      status: 'active',
      'settings.isVisible': true
    })
    .select('profile isOnline lastSeen')
    .limit(limit * 1)
    .skip((page - 1) * limit);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
router.get('/profile/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('profile isOnline lastSeen');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update own profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user.userId);

    // Update profile fields
    Object.keys(updates).forEach(key => {
      if (user.profile[key] !== undefined) {
        user.profile[key] = updates[key];
      }
    });

    await user.save();
    res.json({ message: 'Profile updated', profile: user.profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Swipe on user (like/pass)
router.post('/swipe', auth, async (req, res) => {
  try {
    const { targetUserId, direction } = req.body; // direction: 'left' or 'right'
    const currentUser = await User.findById(req.user.userId);

    // Add swipe record
    currentUser.swipes.push({
      userId: targetUserId,
      direction
    });

    let isMatch = false;

    // Check for match if it's a right swipe
    if (direction === 'right') {
      const targetUser = await User.findById(targetUserId);
      const targetSwipedRight = targetUser.swipes.find(
        swipe => swipe.userId.toString() === currentUser._id.toString() && swipe.direction === 'right'
      );

      if (targetSwipedRight) {
        // It's a match!
        isMatch = true;
        
        // Add match to both users
        currentUser.matches.push({ userId: targetUserId });
        targetUser.matches.push({ userId: currentUser._id });
        
        await targetUser.save();
      }
    }

    await currentUser.save();

    res.json({ 
      message: 'Swipe recorded', 
      isMatch,
      matchId: isMatch ? targetUserId : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get matches
router.get('/matches', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('matches.userId', 'profile isOnline lastSeen');
    
    res.json(user.matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Report user
router.post('/report', auth, async (req, res) => {
  try {
    const { userId, reason } = req.body;
    const reportedUser = await User.findById(userId);

    if (!reportedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    reportedUser.reports.push({
      reportedBy: req.user.userId,
      reason
    });

    await reportedUser.save();
    res.json({ message: 'Report submitted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;