const mongoose = require('mongoose');

const athleteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  sport: { type: String, required: true },
  fundingGoal: { type: Number, required: true },
  earningsPercentage: { type: Number, required: true },
  duration: { type: Number, required: true },
  contractActivation: { type: Number, required: true },
  performanceData: { type: Array, default: [] }
});

module.exports = mongoose.model('Athlete', athleteSchema);
