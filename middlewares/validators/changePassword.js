const { body } = require('express-validator');
const UserModel = require('../../models/User');
const bcrypt = require('bcrypt');

const minPassLength = process.env.MIN_PASS_LENGTH ?? 6;

module.exports = [
  body('current_password').notEmpty().custom(async (value) => {
    const user = await UserModel.findOne({ email: User.email });
    if (!bcrypt.compareSync(value, user.password))
      throw new Error('Current password is incorrect!');
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
