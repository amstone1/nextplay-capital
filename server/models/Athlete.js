const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  winner: Number,
  loser: Number,
  tiebreak: Number,
  winnerTiebreak: Number
}, { _id: false });

const setSchema = new mongoose.Schema({
  '1': scoreSchema,
  '2': scoreSchema,
  '3': scoreSchema
}, { _id: false });

const athleteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sport: {
    type: String,
    required: true
  },
  fundingGoal: {
    type: Number,
    required: true
  },
  amountInvested: {
    type: Number,
    default: 0
  },
  earningsOption: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  earningsPercentage: {
    type: Number,
    required: function() { return this.earningsOption === 'percentage'; }
  },
  durationYears: {
    type: Number,
    required: function() { return this.earningsOption === 'percentage'; }
  },
  firstXPercentage: {
    type: Number,
    required: function() { return this.earningsOption === 'fixed'; }
  },
  firstYDollars: {
    type: Number,
    required: function() { return this.earningsOption === 'fixed'; }
  },
  contractActivation: {
    type: Number,
    required: true
  },
  utrUserId: {
    type: String,
    sparse: true,
    unique: true,
    required: function() { return this.sport === 'Tennis'; }
  },
  tennisAbstractId: {
    type: String,
    sparse: true,
    unique: true,
    required: function() { return this.sport === 'Tennis' && !this.noTennisAbstractProfile; }
  },
  noTennisAbstractProfile: {
    type: Boolean,
    default: false
  },
  utrData: {
    profileData: {
      id: String,
      name: String,
      nationality: String,
      profilePictureUrl: String
    },
    currentRatings: {
      singlesUtr: Number,
      doublesUtr: Number,
      singlesStatus: String,
      doublesStatus: String
    },
    overallStats: {
      totalMatches: Number,
      wins: Number,
      losses: Number,
      winPercentage: Number
    },
    performanceTrend: {
      utrProgression: [{
        date: Date,
        utr: Number
      }],
      recentPerformance: {
        recentWins: Number,
        recentLosses: Number,
        recentWinPercentage: Number
      }
    },
    strengthOfSchedule: {
      average: Number,
      highest: Number,
      lowest: Number
    },
    recentMatches: [{
      date: Date,
      eventName: String,
      opponent: String,
      opponentUTR: Number,
      score: setSchema,
      outcome: String
    }],
    winPercentageByUTRRange: {
      lower: Number,
      similar: Number,
      higher: Number
    },
    performanceAnalytics: {
      averageUTRChange: { type: Number, default: null },
      positiveUTRChanges: { type: Number, default: 0 },
      negativeUTRChanges: { type: Number, default: 0 },
      longestWinStreak: { type: Number, default: 0 },
      averageWinStreak: { type: Number, default: null }
    }
  },
  tennisAnalytics: {
    name: String,
    currentRank: String,
    careerHighRank: String,
    overallStats: {
      matches: Number,
      wonLost: String,
      winPercentage: Number
    },
    surfacePerformance: [{
      surface: String,
      matches: Number,
      winPercentage: Number
    }],
    servingStats: {
      acePercentage: Number,
      doubleFaultPercentage: Number,
      firstServePercentage: Number,
      firstServeWonPercentage: Number,
      secondServeWonPercentage: Number,
      breakPointsSavedPercentage: Number,
      serviceGamesWonPercentage: Number
    },
    returningStats: {
      firstServeReturnPointsWonPercentage: Number,
      secondServeReturnPointsWonPercentage: Number,
      breakPointsConvertedPercentage: Number,
      returnGamesWonPercentage: Number
    },
    totalPointsWonPercentage: Number,
    recentMatches: [{
      date: String,
      tournament: String,
      surface: String,
      opponent: String,
      score: String,
      round: String
    }]
  }
}, { timestamps: true });

module.exports = mongoose.model('Athlete', athleteSchema);