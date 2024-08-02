const axios = require('axios');

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchUTRData = async (utrUserId, retries = 0) => {
  try {
    console.log(`Fetching UTR data for user ID: ${utrUserId}`);
    
    const [profileResponse, resultsResponse] = await Promise.all([
      axios.get(`https://app.universaltennis.com/api/v1/player/${utrUserId}/profile`),
      axios.get(`https://app.universaltennis.com/api/v1/player/${utrUserId}/results`, {
        params: {
          matchType: 'singles,doubles',
          page: 1,
          pageSize: 100
        }
      })
    ]);

    console.log('UTR Profile and Results data fetched successfully');

    return processUTRData(profileResponse.data, resultsResponse.data);
  } catch (error) {
    console.error('Error fetching UTR data:', error.response ? error.response.data : error.message);
    
    if (retries < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds... (Attempt ${retries + 1} of ${MAX_RETRIES})`);
      await wait(RETRY_DELAY);
      return fetchUTRData(utrUserId, retries + 1);
    } else {
      console.error('Max retries reached. Unable to fetch UTR data.');
      throw new Error('Failed to fetch UTR data after multiple attempts');
    }
  }
};

const processUTRData = (profile, results) => {
  return {
    profileData: extractPlayerInfo(profile),
    currentRatings: extractCurrentRatings(profile),
    overallStats: calculateOverallStats(results),
    performanceTrend: {
      utrProgression: calculateUTRProgression(results, profile.id),
      recentPerformance: calculateRecentPerformance(results, profile.id)
    },
    strengthOfSchedule: calculateStrengthOfSchedule(results, profile.id),
    recentMatches: extractRecentMatches(results, profile.id, 10),
    winPercentageByUTRRange: calculateWinPercentageByUTRRange(results, profile.id),
    performanceAnalytics: calculatePerformanceAnalytics(results, profile.id)
  };
};

const extractPlayerInfo = (profile) => ({
  id: profile.id,
  name: profile.displayName,
  nationality: profile.nationality,
  profilePictureUrl: profile.profilePictureUrl
});

const extractCurrentRatings = (profile) => ({
  singlesUtr: profile.singlesUtr,
  doublesUtr: profile.doublesUtr,
  singlesStatus: profile.ratingStatusSingles,
  doublesStatus: profile.ratingStatusDoubles
});

const calculateOverallStats = (results) => {
  const allMatches = results.events.flatMap(event => event.draws.flatMap(draw => draw.results));
  const wins = allMatches.filter(match => match.isWinner).length;
  const total = allMatches.length;
  const losses = total - wins;

  return {
    totalMatches: total,
    wins,
    losses,
    winPercentage: total > 0 ? (wins / total * 100).toFixed(2) : 0
  };
};

const calculateUTRProgression = (results, playerId) => {
  const allMatches = results.events.flatMap(event => event.draws.flatMap(draw => draw.results));
  return allMatches
    .filter(match => match.players.winner1.id === playerId || match.players.loser1.id === playerId)
    .map(match => ({
      date: match.date,
      utr: match.players.winner1.id === playerId ? match.players.winner1.singlesUtrAfter : match.players.loser1.singlesUtrAfter
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

const calculateRecentPerformance = (results, playerId, recentMatchCount = 10) => {
  const allMatches = results.events.flatMap(event => event.draws.flatMap(draw => draw.results));
  const recentMatches = allMatches
    .filter(match => match.players.winner1.id === playerId || match.players.loser1.id === playerId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, recentMatchCount);

  const wins = recentMatches.filter(match => match.players.winner1.id === playerId).length;
  const total = recentMatches.length;

  return {
    recentWins: wins,
    recentLosses: total - wins,
    recentWinPercentage: total > 0 ? (wins / total * 100).toFixed(2) : 0
  };
};

const calculateStrengthOfSchedule = (results, playerId) => {
  const allMatches = results.events.flatMap(event => event.draws.flatMap(draw => draw.results));
  const opponentUtrs = allMatches.map(match => 
    match.players.winner1.id === playerId ? match.players.loser1.singlesUtr : match.players.winner1.singlesUtr
  ).filter(utr => utr !== undefined && utr !== null);

  return {
    average: opponentUtrs.length > 0 ? (opponentUtrs.reduce((sum, utr) => sum + utr, 0) / opponentUtrs.length).toFixed(2) : 0,
    highest: opponentUtrs.length > 0 ? Math.max(...opponentUtrs) : 0,
    lowest: opponentUtrs.length > 0 ? Math.min(...opponentUtrs) : 0
  };
};

const extractRecentMatches = (results, playerId, count) => {
  const allMatches = results.events.flatMap(event => 
    event.draws.flatMap(draw => 
      draw.results.map(result => ({
        date: result.date,
        eventName: event.name,
        opponent: result.players.winner1.id === playerId ? result.players.loser1.displayName : result.players.winner1.displayName,
        opponentUTR: result.players.winner1.id === playerId ? result.players.loser1.singlesUtr : result.players.winner1.singlesUtr,
        score: result.score,
        outcome: result.isWinner ? 'win' : 'loss'
      }))
    )
  );

  return allMatches
    .filter(match => match.opponent !== undefined)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, count);
};

const calculateWinPercentageByUTRRange = (results, playerId) => {
  const allMatches = results.events.flatMap(event => event.draws.flatMap(draw => draw.results));
  const ranges = {
    lower: { wins: 0, total: 0 },
    similar: { wins: 0, total: 0 },
    higher: { wins: 0, total: 0 }
  };

  allMatches.forEach(match => {
    const playerUTR = match.players.winner1.id === playerId ? match.players.winner1.singlesUtr : match.players.loser1.singlesUtr;
    const opponentUTR = match.players.winner1.id === playerId ? match.players.loser1.singlesUtr : match.players.winner1.singlesUtr;
    const isWin = match.players.winner1.id === playerId;

    if (playerUTR === undefined || opponentUTR === undefined) return;

    let range;
    if (opponentUTR < playerUTR - 1) range = 'lower';
    else if (opponentUTR > playerUTR + 1) range = 'higher';
    else range = 'similar';

    ranges[range].total++;
    if (isWin) ranges[range].wins++;
  });

  return Object.entries(ranges).reduce((acc, [key, value]) => {
    acc[key] = value.total > 0 ? (value.wins / value.total * 100).toFixed(2) : 0;
    return acc;
  }, {});
};

const calculatePerformanceAnalytics = (results, playerId) => {
  const allMatches = results.events.flatMap(event => event.draws.flatMap(draw => draw.results));
  const playerMatches = allMatches.filter(match => match.players.winner1.id === playerId || match.players.loser1.id === playerId);

  const utrChanges = playerMatches.map(match => {
    const playerUTRBefore = match.players.winner1.id === playerId ? match.players.winner1.singlesUtrBefore : match.players.loser1.singlesUtrBefore;
    const playerUTRAfter = match.players.winner1.id === playerId ? match.players.winner1.singlesUtrAfter : match.players.loser1.singlesUtrAfter;
    return playerUTRAfter - playerUTRBefore;
  }).filter(change => !isNaN(change)); // Filter out NaN values

  const averageUTRChange = utrChanges.length > 0 ? utrChanges.reduce((sum, change) => sum + change, 0) / utrChanges.length : 0;
  const positiveUTRChanges = utrChanges.filter(change => change > 0).length;
  const negativeUTRChanges = utrChanges.filter(change => change < 0).length;

  const winStreaks = playerMatches.reduce((streaks, match, index) => {
    const isWin = match.players.winner1.id === playerId;
    if (isWin && (index === 0 || !playerMatches[index - 1].isWinner)) {
      streaks.push(1);
    } else if (isWin) {
      streaks[streaks.length - 1]++;
    }
    return streaks;
  }, []);

  return {
    averageUTRChange: isNaN(averageUTRChange) ? 0 : parseFloat(averageUTRChange.toFixed(3)),
    positiveUTRChanges,
    negativeUTRChanges,
    longestWinStreak: winStreaks.length > 0 ? Math.max(...winStreaks) : 0,
    averageWinStreak: winStreaks.length > 0 ? parseFloat((winStreaks.reduce((sum, streak) => sum + streak, 0) / winStreaks.length).toFixed(1)) : 0
  };
};

module.exports = { fetchUTRData };