const Joi = require('joi');

const athleteSchema = Joi.object({
  name: Joi.string().required(),
  sport: Joi.string().required(),
  fundingGoal: Joi.number().required(),
  earningsPercentage: Joi.number().required(),
  duration: Joi.number().required(),
  contractActivation: Joi.number().required(),
  performanceData: Joi.array().items(Joi.object()).optional()
});

module.exports = athleteSchema;
