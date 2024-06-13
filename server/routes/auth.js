const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // Add this line

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, username, userType, athleteInfo } = req.body;
  if (!email || !password || !username || !userType) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  if (userType === 'athlete') {
    const {
      sport,
      fundingGoal,
      earningsOption,
      earningsPercentage,
      durationYears,
      firstXPercentage,
      firstYDollars,
      contractActivation,
    } = athleteInfo;

    if (
      !sport ||
      !fundingGoal ||
      !earningsOption ||
      !contractActivation ||
      (earningsOption === 'percentage' && (!earningsPercentage || !durationYears)) ||
      (earningsOption === 'fixed' && (!firstXPercentage || !firstYDollars))
    ) {
      return res.status(400).json({ message: 'Please provide all required athlete fields' });
    }

    if (fundingGoal > 1000000) {
      return res.status(400).json({ message: 'Funding goal cannot exceed $1,000,000' });
    }

    if (earningsOption === 'percentage' && earningsPercentage > 20) {
      return res.status(400).json({ message: 'Committed percentage of earnings cannot exceed 20%' });
    }

    if (earningsOption === 'fixed' && (firstXPercentage > 50 || firstYDollars <= fundingGoal * 1.25)) {
      return res.status(400).json({ message: 'First percentage cannot exceed 50% and the return must be at least 25% more than the funding goal' });
    }

    if (durationYears > 8) {
      return res.status(400).json({ message: 'Duration cannot exceed 8 years' });
    }
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, username, userType });
    await user.save();

    if (userType === 'athlete') {
      const athlete = new Athlete({
        user: user._id,
        sport: athleteInfo.sport,
        fundingGoal: athleteInfo.fundingGoal,
        earningsOption: athleteInfo.earningsOption,
        earningsPercentage: athleteInfo.earningsPercentage,
        durationYears: athleteInfo.durationYears,
        firstXPercentage: athleteInfo.firstXPercentage,
        firstYDollars: athleteInfo.firstYDollars,
        contractActivation: athleteInfo.contractActivation,
      });
      await athlete.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password) {
    return res.status(400).json({ message: 'Please provide email/username and password' });
  }

  try {
    // Find the user by email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Add the new route to get user information
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
