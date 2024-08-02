const express = require('express');
const connectDB = require('./config/db');
<<<<<<< HEAD
const loadEnv = require('./config/envLoader');
=======
const dotenv = require('dotenv');
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
const cors = require('cors');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/authMiddleware');
<<<<<<< HEAD
const axios = require('axios');
const path = require('path');

// Load environment variables
loadEnv();

// Connect to database
connectDB();

// Initialize Stripe with the secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware
=======
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

dotenv.config();
connectDB();

const app = express();
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
app.use(cors());
app.use(express.json());
app.use('/api/', rateLimiter);

<<<<<<< HEAD
// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Debug route
app.get('/api/debug', (req, res) => {
  res.json({ message: 'Debug route is working', timestamp: new Date().toISOString() });
});

=======
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
// Import routes
const athleteRoutes = require('./routes/athletes');
const investorRoutes = require('./routes/investors');
const authRoutes = require('./routes/auth');
const contractRoutes = require('./routes/contracts');
const paymentRoutes = require('./routes/payments');
const verifyRoutes = require('./routes/verify');
const investmentRoutes = require('./routes/investments');
<<<<<<< HEAD
const tennisRoutes = require('./routes/tennis');
=======
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a

// Use routes
app.use('/api/athletes', athleteRoutes);
app.use('/api/investors', investorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/investments', investmentRoutes);
<<<<<<< HEAD
app.use('/api/tennis', (req, res, next) => {
  console.log('Tennis route accessed:', req.method, req.url);
  next();
}, tennisRoutes);

// UTR API Proxy (no authentication required)
app.use('/api/utr', async (req, res, next) => {
  try {
    console.log('UTR API Proxy Request:', req.method, req.url);
    const utrResponse = await axios({
      method: req.method,
      url: `https://app.universaltennis.com/api/v1${req.url}`,
      data: req.body,
      headers: {
        'User-Agent': 'NextPlay Capital/1.0',
        ...req.headers,
      },
      validateStatus: () => true, // Resolve for all status codes
    });
    console.log('UTR API Proxy Response Status:', utrResponse.status);
    console.log('UTR API Proxy Response Data:', JSON.stringify(utrResponse.data, null, 2));
    res.status(utrResponse.status).json(utrResponse.data);
  } catch (error) {
    console.error('UTR API Proxy Error:', error.message);
    next(error);
  }
});

// Endpoint to create a payment intent with authentication
app.post('/api/create-payment-intent', authMiddleware, async (req, res, next) => {
=======

// Endpoint to create a payment intent with authentication
app.post('/api/create-payment-intent', authMiddleware, async (req, res) => {
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
  try {
    const { amount, athleteId } = req.body;

    console.log('Creating payment intent:', { amount, athleteId });
<<<<<<< HEAD
    console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Is set' : 'Is not set');

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount provided' });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key is not configured');
    }
=======
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { athleteId },
    });

    console.log('Payment intent created:', paymentIntent.id);

<<<<<<< HEAD
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    next(error);
  }
});

// Tennis Abstract API Proxy (no authentication required)
app.use('/api/tennis-abstract', async (req, res, next) => {
  try {
    console.log('Tennis Abstract API Proxy Request:', req.method, req.url);
    const tennisAbstractResponse = await axios({
      method: req.method,
      url: `https://tennisabstract.com${req.url}`,
      data: req.body,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        ...req.headers,
      },
      validateStatus: () => true, // Resolve for all status codes
    });
    console.log('Tennis Abstract API Proxy Response Status:', tennisAbstractResponse.status);
    res.status(tennisAbstractResponse.status).send(tennisAbstractResponse.data);
  } catch (error) {
    console.error('Tennis Abstract API Proxy Error:', error.message);
    next(error);
  }
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

app.use((req, res, next) => {
  console.log('Unhandled request:', req.method, req.originalUrl);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected error occurred',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; // Export for testing purposes
=======
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
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
