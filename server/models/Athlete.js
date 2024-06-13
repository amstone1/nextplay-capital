const mongoose = require('mongoose');

const athleteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sport: { type: String, required: true },
  fundingGoal: { type: Number, required: true },
  earningsOption: { type: String, required: true },
  earningsPercentage: { type: Number },
  durationYears: { type: Number },
  firstXPercentage: { type: Number },
  firstYDollars: { type: Number },
  contractActivation: { type: Number, required: true },
  performanceData: { type: Array, default: [] }
});

module.exports = mongoose.model('Athlete', athleteSchema);
