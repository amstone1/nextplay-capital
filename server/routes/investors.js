const express = require('express');
const router = express.Router();
const Investor = require('../models/Investor');

router.get('/', async (req, res) => {
  try {
    const investors = await Investor.find();
    res.json(investors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
