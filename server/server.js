const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/authMiddleware');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/', rateLimiter);

// Import routes
const athleteRoutes = require('./routes/athletes');
const investorRoutes = require('./routes/investors');
const authRoutes = require('./routes/auth');
const contractRoutes = require('./routes/contracts');
const paymentRoutes = require('./routes/payments');
const verifyRoutes = require('./routes/verify');
const investmentRoutes = require('./routes/investments');

// Use routes
app.use('/api/athletes', athleteRoutes);
app.use('/api/investors', investorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/investments', investmentRoutes);

// Endpoint to create a payment intent with authentication
app.post('/api/create-payment-intent', authMiddleware, async (req, res) => {
  try {
    const { amount, athleteId } = req.body;

    console.log('Creating payment intent:', { amount, athleteId });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { athleteId },
    });

    console.log('Payment intent created:', paymentIntent.id);

    res.send({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));