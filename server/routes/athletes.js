const express = require('express');
const router = express.Router();
const Athlete = require('../models/Athlete');
const authMiddleware = require('../middleware/authMiddleware');
const athleteSchema = require('../validation/athleteValidation');

router.post('/', authMiddleware, async (req, res) => {
  const { error } = athleteSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const athlete = new Athlete({ ...req.body, user: req.user.id });
    await athlete.save();
    res.status(201).json(athlete);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const athlete = await Athlete.findOne({ user: req.user.id });
    res.json(athlete);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
