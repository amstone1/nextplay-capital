const express = require('express');
const router = express.Router();
const Contract = require('../models/Contract');

router.get('/', async (req, res) => {
  try {
    const contracts = await Contract.find().populate('athlete').populate('investor');
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
