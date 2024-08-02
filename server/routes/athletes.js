const express = require('express');
const Athlete = require('../models/Athlete');
const authMiddleware = require('../middleware/authMiddleware');
const { athleteValidationRules, validateAthlete } = require('../validation/athleteValidation');
const axios = require('axios');
const cheerio = require('cheerio');
<<<<<<< HEAD
const { fetchUTRData } = require('../utils/utrService');
=======
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a

const router = express.Router();

// Helper function for consistent error logging
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

// Get all athletes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sports = req.query.sports ? req.query.sports.split(',') : [];
    
    const query = sports.length > 0 ? { sport: { $in: sports } } : {};

    const totalAthletes = await Athlete.countDocuments(query);
    const totalPages = Math.ceil(totalAthletes / limit);
    
    const athletes = await Athlete.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      athletes,
      currentPage: page,
      totalPages,
      totalAthletes,
      hasNextPage: page < totalPages
    });
  } catch (error) {
    logError('Error fetching athletes:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Get a single athlete
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const athlete = await Athlete.findById(req.params.id);
    if (!athlete) {
      return res.status(404).json({ message: 'Athlete not found' });
    }

<<<<<<< HEAD
    if (athlete.sport === 'Tennis') {
      if (athlete.utrUserId) {
        try {
          const utrData = await fetchUTRData(athlete.utrUserId);
          athlete.utrData = utrData;
        } catch (utrError) {
          logError('Error fetching UTR data:', utrError);
        }
      }

      if (athlete.tennisAbstractId && !athlete.noTennisAbstractProfile) {
        try {
          console.log(`Fetching data for Tennis Abstract ID: ${athlete.tennisAbstractId}`);
          const url = `https://www.tennisabstract.com/cgi-bin/player.cgi?p=${athlete.tennisAbstractId}`;
          console.log(`Requesting URL: ${url}`);
          const response = await axios.get(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000 // 10 seconds timeout
          });
          console.log('Response status:', response.status);
          console.log('Response headers:', response.headers);

          if (response.status !== 200) {
            throw new Error(`Unexpected status code: ${response.status}`);
          }

          const processedData = processTeennisAbstractData(response.data);
          console.log('Processed data:', JSON.stringify(processedData, null, 2));
          
          if (processedData.error) {
            throw new Error(processedData.error);
          }

          athlete.tennisAnalytics = processedData;
        } catch (error) {
          logError('Error fetching Tennis Abstract data:', error);
          athlete.tennisAnalytics = { 
            error: 'Failed to fetch Tennis Abstract data',
            details: error.message
          };
        }
      }

      await athlete.save();
=======
    if (athlete.sport === 'Tennis' && athlete.tennisAbstractId) {
      try {
        console.log(`Fetching data for Tennis Abstract ID: ${athlete.tennisAbstractId}`);
        const url = `https://www.tennisabstract.com/cgi-bin/player.cgi?p=${athlete.tennisAbstractId}`;
        console.log(`Requesting URL: ${url}`);
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          timeout: 10000 // 10 seconds timeout
        });
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (response.status !== 200) {
          throw new Error(`Unexpected status code: ${response.status}`);
        }

        const processedData = processTeennisAbstractData(response.data);
        console.log('Processed data:', JSON.stringify(processedData, null, 2));
        
        if (processedData.error) {
          throw new Error(processedData.error);
        }

        athlete.tennisAnalytics = processedData;
        await athlete.save();
      } catch (error) {
        logError('Error fetching Tennis Abstract data:', error);
        athlete.tennisAnalytics = { 
          error: 'Failed to fetch Tennis Abstract data',
          details: error.message
        };
      }
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
    }

    res.json(athlete);
  } catch (error) {
    logError('Error fetching athlete:', error);
    res.status(500).json({ message: 'An error occurred while fetching the athlete', details: error.message });
  }
});

// Create a new athlete
router.post('/', authMiddleware, athleteValidationRules(), validateAthlete, async (req, res) => {
  try {
    const athlete = new Athlete(req.body);
    
<<<<<<< HEAD
    if (athlete.sport === 'Tennis') {
      if (athlete.utrUserId) {
        try {
          const utrData = await fetchUTRData(athlete.utrUserId);
          athlete.utrData = utrData;
        } catch (utrError) {
          logError('Error fetching UTR data for new athlete:', utrError);
        }
      }

      if (athlete.tennisAbstractId && !athlete.noTennisAbstractProfile) {
        try {
          const url = `https://www.tennisabstract.com/cgi-bin/player.cgi?p=${athlete.tennisAbstractId}`;
          const response = await axios.get(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000 // 10 seconds timeout
          });
          const processedData = processTeennisAbstractData(response.data);
          if (processedData.error) {
            throw new Error(processedData.error);
          }
          athlete.tennisAnalytics = processedData;
        } catch (error) {
          logError('Error fetching Tennis Abstract data for new athlete:', error);
          athlete.tennisAnalytics = { error: 'Failed to fetch Tennis Abstract data', details: error.message };
        }
=======
    if (athlete.sport === 'Tennis' && athlete.tennisAbstractId) {
      try {
        const url = `https://www.tennisabstract.com/cgi-bin/player.cgi?p=${athlete.tennisAbstractId}`;
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          timeout: 10000 // 10 seconds timeout
        });
        const processedData = processTeennisAbstractData(response.data);
        if (processedData.error) {
          throw new Error(processedData.error);
        }
        athlete.tennisAnalytics = processedData;
      } catch (error) {
        logError('Error fetching Tennis Abstract data for new athlete:', error);
        athlete.tennisAnalytics = { error: 'Failed to fetch Tennis Abstract data', details: error.message };
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
      }
    }

    const newAthlete = await athlete.save();
    res.status(201).json(newAthlete);
  } catch (error) {
    logError('Error creating athlete:', error);
    res.status(400).json({ message: 'An error occurred while creating the athlete', details: error.message });
  }
});

// Update an athlete
router.put('/:id', authMiddleware, athleteValidationRules(), validateAthlete, async (req, res) => {
  try {
    const athlete = await Athlete.findById(req.params.id);
    if (!athlete) {
      return res.status(404).json({ message: 'Athlete not found' });
    }

    Object.assign(athlete, req.body);

<<<<<<< HEAD
    if (athlete.sport === 'Tennis') {
      if (athlete.utrUserId) {
        try {
          const utrData = await fetchUTRData(athlete.utrUserId);
          athlete.utrData = utrData;
        } catch (utrError) {
          logError('Error fetching UTR data for athlete update:', utrError);
        }
      }

      if (athlete.tennisAbstractId && !athlete.noTennisAbstractProfile) {
        try {
          const url = `https://www.tennisabstract.com/cgi-bin/player.cgi?p=${athlete.tennisAbstractId}`;
          const response = await axios.get(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000 // 10 seconds timeout
          });
          const processedData = processTeennisAbstractData(response.data);
          if (processedData.error) {
            throw new Error(processedData.error);
          }
          athlete.tennisAnalytics = processedData;
        } catch (error) {
          logError('Error fetching Tennis Abstract data for athlete update:', error);
          athlete.tennisAnalytics = { error: 'Failed to fetch Tennis Abstract data', details: error.message };
        }
=======
    if (athlete.sport === 'Tennis' && athlete.tennisAbstractId) {
      try {
        const url = `https://www.tennisabstract.com/cgi-bin/player.cgi?p=${athlete.tennisAbstractId}`;
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          timeout: 10000 // 10 seconds timeout
        });
        const processedData = processTeennisAbstractData(response.data);
        if (processedData.error) {
          throw new Error(processedData.error);
        }
        athlete.tennisAnalytics = processedData;
      } catch (error) {
        logError('Error fetching Tennis Abstract data for athlete update:', error);
        athlete.tennisAnalytics = { error: 'Failed to fetch Tennis Abstract data', details: error.message };
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
      }
    }

    const updatedAthlete = await athlete.save();
    res.json(updatedAthlete);
  } catch (error) {
    logError('Error updating athlete:', error);
    res.status(400).json({ message: 'An error occurred while updating the athlete', details: error.message });
  }
});

// Delete an athlete
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const athlete = await Athlete.findById(req.params.id);
    if (!athlete) {
      return res.status(404).json({ message: 'Athlete not found' });
    }

    await athlete.remove();
    res.json({ message: 'Athlete removed' });
  } catch (error) {
    logError('Error deleting athlete:', error);
    res.status(500).json({ message: 'An error occurred while deleting the athlete', details: error.message });
  }
});

function processTeennisAbstractData(html) {
  try {
    const $ = cheerio.load(html);
    
    const name = $('h1').text().trim();
    console.log('Extracted name:', name);

    if (!name) {
      throw new Error('Unable to extract player name');
    }

    const currentRank = $('td:contains("Current rank:")').next().text().trim();
    const careerHighRank = $('td:contains("Career high rank:")').next().text().trim();
    
    const overallStats = {
      matches: parseInt($('td:contains("Matches:")').next().text().trim()) || 0,
      wonLost: $('td:contains("Won-lost:")').next().text().trim() || 'N/A',
      winPercentage: parseFloat($('td:contains("Winning percentage:")').next().text().trim()) || 0
    };

    const surfacePerformance = ['Hard', 'Clay', 'Grass', 'Carpet'].map(surface => {
      const surfaceData = $(`td:contains("${surface}:")`).next().text().trim().split(' ');
      return {
        surface,
        matches: parseInt(surfaceData[0]) || 0,
        winPercentage: parseFloat(surfaceData[1]?.replace('(', '').replace('%)', '')) || 0
      };
    });

    const servingStats = {
      acePercentage: parseFloat($('td:contains("Ace %:")').next().text().trim()) || 0,
      doubleFaultPercentage: parseFloat($('td:contains("Double fault %:")').next().text().trim()) || 0,
      firstServePercentage: parseFloat($('td:contains("1st serve %:")').next().text().trim()) || 0,
      firstServeWonPercentage: parseFloat($('td:contains("1st serve won %:")').next().text().trim()) || 0,
      secondServeWonPercentage: parseFloat($('td:contains("2nd serve won %:")').next().text().trim()) || 0,
      breakPointsSavedPercentage: parseFloat($('td:contains("Break points saved %:")').next().text().trim()) || 0,
      serviceGamesWonPercentage: parseFloat($('td:contains("Service games won %:")').next().text().trim()) || 0
    };

    const returningStats = {
      firstServeReturnPointsWonPercentage: parseFloat($('td:contains("1st serve return points won %:")').next().text().trim()) || 0,
      secondServeReturnPointsWonPercentage: parseFloat($('td:contains("2nd serve return points won %:")').next().text().trim()) || 0,
      breakPointsConvertedPercentage: parseFloat($('td:contains("Break points converted %:")').next().text().trim()) || 0,
      returnGamesWonPercentage: parseFloat($('td:contains("Return games won %:")').next().text().trim()) || 0
    };

    const totalPointsWonPercentage = parseFloat($('td:contains("Total points won %:")').next().text().trim()) || 0;

    const recentMatches = $('#matches tbody tr').slice(0, 10).map((i, el) => ({
      date: $(el).find('td').eq(0).text().trim(),
      tournament: $(el).find('td').eq(1).text().trim(),
      surface: $(el).find('td').eq(2).text().trim(),
      opponent: $(el).find('td').eq(4).text().trim(),
      score: $(el).find('td').eq(5).text().trim(),
      round: $(el).find('td').eq(6).text().trim()
    })).get();

    return {
      name,
      currentRank,
      careerHighRank,
      overallStats,
      surfacePerformance,
      servingStats,
      returningStats,
      totalPointsWonPercentage,
      recentMatches
    };
  } catch (error) {
    console.error('Error processing Tennis Abstract data:', error);
    return { error: 'Failed to process Tennis Abstract data', details: error.message };
  }
}

module.exports = router;