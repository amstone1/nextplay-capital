const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

const TENNIS_ABSTRACT_URL = 'https://www.tennisabstract.com';

// Search for players
router.get('/search', async (req, res, next) => {
  console.log('Tennis search route hit');
  try {
    const { q } = req.query;
    console.log(`Received search request for query: ${q}`);

    if (!q || q.length < 3) {
      console.log('Search query too short');
      return res.status(400).json({ message: 'Search query must be at least 3 characters long' });
    }

    const searchUrl = `${TENNIS_ABSTRACT_URL}/cgi-bin/player-search.cgi?q=${encodeURIComponent(q)}`;
    console.log(`Sending request to: ${searchUrl}`);

    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    console.log(`Received response with status: ${response.status}`);
    console.log(`Response data: ${response.data.substring(0, 200)}...`); // Log first 200 characters of response

    const $ = cheerio.load(response.data);

    const searchResults = [];
    $('table.searchResults tr').each((index, element) => {
      if (index === 0) return; // Skip header row
      const cols = $(element).find('td');
      const playerLink = $(cols[0]).find('a').attr('href');
      const playerId = playerLink ? playerLink.split('=')[1] : null;
      searchResults.push({
        id: playerId,
        name: $(cols[0]).text().trim(),
        rank: $(cols[1]).text().trim(),
        age: $(cols[2]).text().trim(),
        hand: $(cols[3]).text().trim(),
      });
    });

    console.log(`Found ${searchResults.length} results`);
    console.log('Search results:', JSON.stringify(searchResults, null, 2));
    res.json(searchResults);
  } catch (error) {
    console.error('Error searching for players:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      console.error('Response data:', error.response.data);
    }
    next(error);
  }
});

module.exports = router;

// Get player statistics
router.get('/stats/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const playerData = await scrapePlayerData(id);
    res.json(playerData);
  } catch (error) {
    console.error('Error fetching player statistics:', error);
    res.status(500).json({ message: 'An error occurred while fetching player statistics' });
  }
});

// Get player ranking history
router.get('/ranking-history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${TENNIS_ABSTRACT_URL}/cgi-bin/player-rank-graph.cgi?${id}`);
    const $ = cheerio.load(response.data);

    const rankingHistory = [];
    $('table tr').each((index, element) => {
      if (index === 0) return; // Skip header row
      const cols = $(element).find('td');
      rankingHistory.push({
        date: $(cols[0]).text().trim(),
        rank: parseInt($(cols[1]).text().trim(), 10),
      });
    });

    res.json(rankingHistory);
  } catch (error) {
    console.error('Error fetching ranking history:', error);
    res.status(500).json({ message: 'An error occurred while fetching ranking history' });
  }
});

module.exports = router;