const express = require('express');
const router = express.Router();
const Contract = require('../models/Contract');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Contract.countDocuments();
    const contracts = await Contract.find()
      .skip(startIndex)
      .limit(limit)
      .populate('athlete', 'name sport')
      .populate('investor', 'username');

    res.json({
      contracts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalContracts: total
    });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ message: 'An error occurred while fetching contracts' });
  }
});

module.exports = router;