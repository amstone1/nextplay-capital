const express = require('express');
const router = express.Router();
const Investment = require('../models/Investment');
const Athlete = require('../models/Athlete');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

router.post('/', authMiddleware, async (req, res, next) => {
  const { athleteId, amount, paymentIntentId } = req.body;
  console.log(`Received investment request: athleteId=${athleteId}, amount=${amount}, paymentIntentId=${paymentIntentId}`);
  console.log(`User ID from auth middleware: ${req.user.id}`);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('Starting investment processing');

    // Find the athlete
    const athlete = await Athlete.findById(athleteId).session(session);
    if (!athlete) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Athlete not found' });
    }
    console.log(`Found athlete: ${athlete._id}, name: ${athlete.name}`);

    // Create the investment
    const investment = new Investment({
      investor: req.user.id,
      athlete: athleteId,
      amount: parseFloat(amount),
      paymentIntentId,
      date: new Date()
    });

    console.log('Saving investment:', investment);
    const savedInvestment = await investment.save({ session });
    console.log(`Investment saved: ${savedInvestment._id}`);

    // Update the athlete's invested amount
    athlete.amountInvested = (athlete.amountInvested || 0) + parseFloat(amount);
    const updatedAthlete = await athlete.save({ session });
    console.log(`Updated athlete invested amount: ${updatedAthlete.amountInvested}`);

    await session.commitTransaction();
    console.log('Transaction committed');
    session.endSession();

    res.status(201).json({ 
      message: 'Investment successful',
      investment: savedInvestment,
      updatedAthlete: {
        name: updatedAthlete.name,
        amountInvested: updatedAthlete.amountInvested,
        progress: (updatedAthlete.amountInvested / updatedAthlete.fundingGoal) * 100
      }
    });
  } catch (error) {
    console.error('Error in investment processing:', error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ 
      message: 'An error occurred while processing the investment', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;