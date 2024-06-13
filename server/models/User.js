const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  userType: { type: String, required: true }, // Add userType field
});

module.exports = mongoose.model('User', userSchema);
