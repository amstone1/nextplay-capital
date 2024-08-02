const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Athlete = require('../models/Athlete');
const Investor = require('../models/Investor');
const authMiddleware = require('../middleware/authMiddleware');
const axios = require('axios');
const cheerio = require('cheerio');

function fuzzyNameMatch(name1, name2) {
  const cleanName = (name) => name.toLowerCase().replace(/[^a-z]/g, '');
  return cleanName(name1) === cleanName(name2);
}

<<<<<<< HEAD
=======
// Helper function for consistent error logging
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
function logError(message, error) {
  console.error(message, {
    error: error.message,
    stack: error.stack,
    response: error.response ? {
      status: error.response.status,
      headers: error.response.headers,
      data: error.response.data
    } : 'No response data'
  });
}

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('username', 'Username is required').not().isEmpty(),
  check('userType', 'User type must be either athlete or investor').isIn(['athlete', 'investor']),
  check('phoneNumber', 'Phone number is required').not().isEmpty(),
  check('athleteInfo.tennisAbstractId', 'Tennis Abstract ID is required for tennis players')
    .if((value, { req }) => req.body.userType === 'athlete' && req.body.athleteInfo.sport === 'Tennis' && !req.body.athleteInfo.noTennisAbstractProfile)
    .not().isEmpty()
], async (req, res) => {
  console.log('Registration attempt:', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, username, userType, phoneNumber, athleteInfo, investorInfo } = req.body;

  try {
<<<<<<< HEAD
=======
    // Check if user already exists
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      console.log('User already exists:', email, username);
      return res.status(400).json({ message: 'User already exists' });
    }

<<<<<<< HEAD
=======
    // Create new user
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
    user = new User({
      email,
      password,
      username,
      userType,
      phoneNumber
    });

    await user.save();
    console.log('User created successfully:', user.username);

<<<<<<< HEAD
    if (userType === 'athlete') {
      console.log('Creating athlete:', athleteInfo);
  
=======
    // Create profile based on user type
    if (userType === 'athlete') {
      console.log('Creating athlete:', athleteInfo);
  
      // Validate Tennis Abstract ID
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
      if (athleteInfo.sport === 'Tennis' && !athleteInfo.noTennisAbstractProfile && athleteInfo.tennisAbstractId) {
        try {
          console.log(`Validating Tennis Abstract ID: ${athleteInfo.tennisAbstractId}`);
          const url = `https://www.tennisabstract.com/cgi-bin/player.cgi?p=${athleteInfo.tennisAbstractId}`;
          const response = await axios.get(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
<<<<<<< HEAD
            timeout: 10000
=======
            timeout: 10000 // 10 seconds timeout
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
          });
          console.log('Tennis Abstract response status:', response.status);
          
          if (response.status !== 200) {
            throw new Error(`Unexpected status code: ${response.status}`);
          }
      
          const $ = cheerio.load(response.data);
          console.log('Cheerio loaded HTML successfully');
      
<<<<<<< HEAD
=======
          // Extract player name from JavaScript code
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
          const scriptContent = $('script:contains("var fullname")').html();
          const nameMatch = scriptContent.match(/var fullname = '(.+?)';/);
          const playerName = nameMatch ? nameMatch[1] : null;
      
          console.log('Extracted player name:', playerName);
      
          if (!playerName) {
            throw new Error('Unable to extract player name from Tennis Abstract');
          }
      
          if (!fuzzyNameMatch(playerName, athleteInfo.name)) {
            throw new Error('Tennis Abstract ID does not match the provided name');
          }
      
          console.log('Tennis Abstract ID validated successfully');
        } catch (error) {
          logError('Error validating Tennis Abstract ID:', error);
          return res.status(400).json({ message: 'Invalid Tennis Abstract ID or unable to verify at this time' });
        }
      }
  
      const athlete = new Athlete({
        user: user._id,
        name: athleteInfo.name,
        sport: athleteInfo.sport,
        fundingGoal: athleteInfo.fundingGoal,
        earningsOption: athleteInfo.earningsOption,
<<<<<<< HEAD
        earningsPercentage: athleteInfo.earningsOption === 'percentage' ? athleteInfo.earningsPercentage : undefined,
        durationYears: athleteInfo.earningsOption === 'percentage' ? athleteInfo.durationYears : undefined,
        firstXPercentage: athleteInfo.earningsOption === 'fixed' ? athleteInfo.firstXPercentage : undefined,
        firstYDollars: athleteInfo.earningsOption === 'fixed' ? athleteInfo.firstYDollars : undefined,
        contractActivation: athleteInfo.contractActivation,
        utrUserId: athleteInfo.sport === 'Tennis' ? athleteInfo.utrUserId : undefined,
        tennisAbstractId: athleteInfo.sport === 'Tennis' && !athleteInfo.noTennisAbstractProfile ? athleteInfo.tennisAbstractId : undefined,
        noTennisAbstractProfile: athleteInfo.sport === 'Tennis' ? athleteInfo.noTennisAbstractProfile : undefined
=======
        earningsPercentage: athleteInfo.earningsOption === 'percentage' ? athleteInfo.earningsPercentage : null,
        durationYears: athleteInfo.earningsOption === 'percentage' ? athleteInfo.durationYears : null,
        firstXPercentage: athleteInfo.earningsOption === 'fixed' ? athleteInfo.firstXPercentage : null,
        firstYDollars: athleteInfo.earningsOption === 'fixed' ? athleteInfo.firstYDollars : null,
        contractActivation: athleteInfo.contractActivation,
        utrUserId: athleteInfo.sport === 'Tennis' ? athleteInfo.utrUserId : null,
        tennisAbstractId: athleteInfo.sport === 'Tennis' && !athleteInfo.noTennisAbstractProfile ? athleteInfo.tennisAbstractId : null,
        noTennisAbstractProfile: athleteInfo.sport === 'Tennis' ? athleteInfo.noTennisAbstractProfile : null
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
      });

      if (athlete.sport === 'Tennis' && athlete.utrUserId) {
        try {
          const utrData = await fetchUTRData(athlete.utrUserId);
<<<<<<< HEAD
          if (utrData && utrData.currentRatings) {
            athlete.utrData = {
              currentRatings: utrData.currentRatings
=======
          if (utrData) {
            athlete.utrData = {
              currentRatings: {
                singlesUtr: utrData.currentRatings.singlesUtr,
                doublesUtr: utrData.currentRatings.doublesUtr
              }
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
            };
          }
        } catch (utrError) {
          console.error('Error fetching UTR data:', utrError);
<<<<<<< HEAD
          // We'll continue with registration but log the error
          // You might want to set a flag in the athlete model or handle this differently
=======
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
        }
      }

      try {
        await athlete.save();
        console.log('Athlete saved successfully');
      } catch (athleteError) {
        console.error('Error saving athlete:', athleteError);
        if (athleteError.name === 'ValidationError') {
          return res.status(400).json({ message: 'Athlete validation error', errors: athleteError.errors });
        }
        throw athleteError;
      }

    } else if (userType === 'investor') {
      console.log('Creating investor profile:', investorInfo);
      const investor = new Investor({
        user: user._id,
        investmentCapacity: investorInfo.investmentCapacity,
        riskTolerance: investorInfo.riskTolerance,
        preferredSports: investorInfo.preferredSports
      });

      await investor.save();
      console.log('Investor profile created:', investor);
    }

<<<<<<< HEAD
=======
    // Create and return JWT token
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            userType: user.userType
          }
        });
      }
    );
  } catch (err) {
    console.error('Registration error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
});

<<<<<<< HEAD

=======
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            userType: user.userType
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profileData = { user };

    if (user.userType === 'athlete') {
      const athlete = await Athlete.findOne({ user: user._id });
      if (athlete && athlete.sport === 'Tennis' && athlete.utrUserId) {
        try {
          const utrData = await fetchUTRData(athlete.utrUserId);
          if (utrData && utrData.currentRatings) {
            athlete.utrData = {
              currentRatings: {
                singlesUtr: utrData.currentRatings.singlesUtr,
                doublesUtr: utrData.currentRatings.doublesUtr
              }
            };
            await athlete.save();
          }
        } catch (utrError) {
          console.error('Error fetching UTR data:', utrError);
        }
      }
      profileData.athlete = athlete;
    } else if (user.userType === 'investor') {
      const investor = await Investor.findOne({ user: user._id });
      profileData.investor = investor;
    }

    res.json(profileData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

async function fetchUTRData(utrUserId) {
<<<<<<< HEAD
  console.log('Fetching UTR data for:', utrUserId);
  try {
    const response = await axios.get(`https://app.universaltennis.com/api/v1/player/${utrUserId}/profile`);
    
    if (response.data && response.data.singlesUtr && response.data.doublesUtr) {
      return {
        currentRatings: {
          singlesUtr: response.data.singlesUtr,
          doublesUtr: response.data.doublesUtr,
          singlesStatus: response.data.singlesRatingStatus,
          doublesStatus: response.data.doublesRatingStatus
        }
      };
    } else {
      console.error('Unexpected UTR API response structure:', response.data);
      throw new Error('Unexpected UTR API response structure');
    }
  } catch (error) {
    console.error('Error fetching UTR data:', error.message);
    throw error;
  }
=======
  // Implement the logic to fetch UTR data
  // This is a placeholder function
  console.log('Fetching UTR data for:', utrUserId);
  // In a real implementation, you would make an API call to UTR here
  return {
    currentRatings: {
      singlesUtr: 10.5, // Example value
      doublesUtr: 10.2  // Example value
    }
  };
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
}

module.exports = router;