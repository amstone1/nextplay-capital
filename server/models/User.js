const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  username: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  userType: { 
    type: String, 
    required: true,
    enum: ['athlete', 'investor', 'admin']
  },
  firstName: String,
  lastName: String,
  phoneNumber: String,
  dateOfBirth: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: null
  },
  passwordResetToken: String,
  passwordResetExpires: Date
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    console.log('Hashing password for user:', this.username);
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully for user:', this.username);
    next();
  } catch (error) {
    console.error('Error hashing password for user:', this.username, error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('Comparing password for user:', this.username);
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password comparison result for user:', this.username, isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords for user:', this.username, error);
    throw new Error(error);
  }
};

userSchema.index({ email: 1, username: 1 });

module.exports = mongoose.model('User', userSchema);