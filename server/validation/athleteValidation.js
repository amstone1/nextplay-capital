const { check, validationResult } = require('express-validator');

const athleteValidationRules = () => {
  return [
    check('name').notEmpty().withMessage('Name is required'),
    check('sport').notEmpty().withMessage('Sport is required'),
    check('fundingGoal')
      .isNumeric()
      .withMessage('Funding goal must be a number')
      .custom((value) => value > 0 && value <= 1000000)
      .withMessage('Funding goal must be a positive number and cannot exceed $1,000,000'),
    check('earningsOption').notEmpty().withMessage('Earnings option is required'),
    check('contractActivation')
      .isNumeric()
      .withMessage('Contract activation amount must be a number')
      .custom((value) => value > 0 && value <= 100)
      .withMessage('Contract activation amount must be between 1 and 100%'),
    check('earningsPercentage')
      .if(check('earningsOption').equals('percentage'))
      .isNumeric()
      .withMessage('Committed percentage of earnings must be a number')
      .custom((value) => value > 0 && value <= 20)
      .withMessage('Committed percentage of earnings must be a positive number and cannot exceed 20%'),
    check('durationYears')
      .if(check('earningsOption').equals('percentage'))
      .isNumeric()
      .withMessage('Duration must be a number')
      .custom((value) => value > 0 && value <= 8)
      .withMessage('Duration must be a positive number and cannot exceed 8 years'),
    check('firstXPercentage')
      .if(check('earningsOption').equals('fixed'))
      .isNumeric()
      .withMessage('First percentage must be a number')
      .custom((value) => value > 0 && value <= 50)
      .withMessage('First percentage must be a positive number and cannot exceed 50%'),
    check('firstYDollars')
      .if(check('earningsOption').equals('fixed'))
      .isNumeric()
      .withMessage('First Y dollars must be a number')
      .custom((value, { req }) => value > req.body.fundingGoal * 1.25)
      .withMessage('The return must be at least 25% more than the funding goal'),
<<<<<<< HEAD
    check('utrUserId')
      .if(check('sport').equals('Tennis'))
      .notEmpty()
      .withMessage('UTR User ID is required for tennis players'),
    check('tennisAbstractId')
      .if(check('sport').equals('Tennis'))
      .custom((value, { req }) => {
        if (req.body.noTennisAbstractProfile) {
          return true;
        }
        return value && value.trim().length > 0;
      })
      .withMessage('Tennis Abstract ID is required unless you don\'t have a profile'),
    check('noTennisAbstractProfile')
      .if(check('sport').equals('Tennis'))
      .isBoolean()
      .withMessage('noTennisAbstractProfile must be a boolean value')
=======
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
  ];
};

const validateAthlete = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  athleteValidationRules,
  validateAthlete,
<<<<<<< HEAD
};
=======
};
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
