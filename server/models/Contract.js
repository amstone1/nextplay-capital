const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  athlete: { type: mongoose.Schema.Types.ObjectId, ref: 'Athlete', required: true },
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'Investor', required: true },
  amount: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Contract', contractSchema);
