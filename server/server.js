const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/', rateLimiter);

app.use('/api/athletes', require('./routes/athletes'));
app.use('/api/investors', require('./routes/investors'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contracts', require('./routes/contracts')); // Add the contracts route
app.use('/api/payments', require('./routes/payments'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
