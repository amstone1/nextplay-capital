const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  athlete: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Athlete', 
    required: true 
  },
  investor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true,
    min: [0, 'Amount must be positive']
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
}, { timestamps: true });

module.exports = mongoose.model('Contract', contractSchema);