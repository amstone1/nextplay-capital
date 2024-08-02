const express = require('express');
const router = express.Router();
const Investor = require('../models/Investor');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Investor.countDocuments();
    const investors = await Investor.find()
      .skip(startIndex)
      .limit(limit)
      .populate('user', 'username email');

    res.json({
      investors,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalInvestors: total
    });
  } catch (error) {
    console.error('Error fetching investors:', error);
    res.status(500).json({ message: 'An error occurred while fetching investors' });
  }
});

module.exports = router;