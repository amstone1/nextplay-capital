const mongoose = require('mongoose');

const investorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalInvestment: { type: Number, required: true },
});

module.exports = mongoose.model('Investor', investorSchema);
