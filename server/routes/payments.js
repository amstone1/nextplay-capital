const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create-payment-intent', authMiddleware, async (req, res) => {
  const { amount, athleteId } = req.body;
  try {
    console.log('Creating payment intent:', { amount, athleteId });

    if (!amount || isNaN(amount) || amount <= 0) {
      console.log('Invalid amount provided:', amount);
      return res.status(400).json({ error: 'Invalid amount provided' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { athleteId },
    });

    console.log('Payment intent created:', paymentIntent.id);

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      error: 'An error occurred while creating the payment intent.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;