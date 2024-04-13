const { body } = require('express-validator');

module.exports = [
  body('title').trim().notEmpty().withMessage('Please enter event title!'),
  body('start')
    .notEmpty()
    .withMessage('Please enter event start date!')
    .isISO8601()
    .withMessage('Invalid start date format!'),
  body('end')
    .notEmpty()
    .withMessage('Please enter event end date!')
    .isISO8601()
    .withMessage('Invalid end date format!'),
  body('end')
    .custom((value, { req }) => {
      return value >= req.body.start;
    })
    .withMessage('End date must be after start date!'),
];
