const { body } = require('express-validator');

module.exports = [
  body('email').notEmpty().withMessage('Please enter your email or username!'),
  body('password').notEmpty().withMessage('Please enter your password!'),
];
