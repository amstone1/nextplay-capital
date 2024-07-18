const mongoose = require('mongoose');

const investorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalInvestment: { 
    type: Number, 
    required: true,
    default: 0,
    min: [0, 'Total investment must be positive']
  },
  investmentCount: {
    type: Number,
    default: 0,
    min: 0
  },
  lastInvestmentDate: {
    type: Date
  }
}, { timestamps: true });

investorSchema.index({ user: 1 });
investorSchema.index({ totalInvestment: -1 });

module.exports = mongoose.model('Investor', investorSchema);