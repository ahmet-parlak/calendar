const { body } = require('express-validator');
const User = require('../../models/User');

const minPassLength = process.env.MIN_PASS_LENGTH ?? 6;

module.exports = [
  body('username').trim().notEmpty().withMessage('Please enter your username!'),
  body('username').custom(async (value) => {
    const user = await User.findOne({ username: value });
    if (user) throw new Error('Username is taken!');
  }),
  body('email').isEmail().withMessage('Please enter a valid email!'),
  body('email').custom(async (value) => {
    const user = await User.findOne({ email: value });
    if (user) throw new Error('E-mail is already in use');
  }),
  body('password')
    .isLength({ min: minPassLength })
    .withMessage(
      `Please create a strong password at least ${minPassLength} characters!`
    ),
  body('confirm_password')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('Passwords do not match!'),
];
