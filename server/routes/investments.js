const express = require('express');
const router = express.Router();
const Investment = require('../models/Investment');
const Athlete = require('../models/Athlete');
<<<<<<< HEAD
const Investor = require('../models/Investor');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

router.post('/', authMiddleware, async (req, res) => {
=======
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

router.post('/', authMiddleware, async (req, res, next) => {
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
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

<<<<<<< HEAD
    // Update the investor's profile
    const investor = await Investor.findOneAndUpdate(
      { user: req.user.id },
      { 
        $inc: { 
          totalInvestment: parseFloat(amount),
          investmentCount: 1
        },
        $set: { lastInvestmentDate: new Date() },
        $push: { 
          investments: {
            investment: savedInvestment._id,
            athlete: athleteId,
            amount: parseFloat(amount)
          }
        }
      },
      { new: true, upsert: true, session }
    );
    console.log(`Updated investor profile: ${investor._id}`);

=======
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
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
<<<<<<< HEAD
      },
      updatedInvestor: {
        totalInvestment: investor.totalInvestment,
        investmentCount: investor.investmentCount,
        lastInvestmentDate: investor.lastInvestmentDate
=======
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
      }
    });
  } catch (error) {
    console.error('Error in investment processing:', error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ 
      message: 'An error occurred while processing the investment', 
<<<<<<< HEAD
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
=======
      error: error.message,
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;