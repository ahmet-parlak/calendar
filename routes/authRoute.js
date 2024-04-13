const express = require('express');
const authController = require('../controllers/authController');
const redirectMiddleware = require('../middlewares/redirectMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const registerValidator = require('../middlewares/validators/register');
const loginValidator = require('../middlewares/validators/login');
const changePasswordValidator = require('../middlewares/validators/changePassword');

const router = express.Router();

router.post(
  '/register',
  redirectMiddleware,
  registerValidator,
  authController.register
);

router.post('/login', redirectMiddleware, authController.login);

router.get('/logout', authMiddleware, loginValidator, authController.logout);

router.post(
  '/change-password',
  authMiddleware,
  changePasswordValidator,
  authController.changePassword
);

module.exports = router;
