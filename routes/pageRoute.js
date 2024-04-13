const express = require('express');
const pageController = require('../controllers/pageController');
const authMiddleware = require('../middlewares/authMiddleware');
const redirectMiddleware = require('../middlewares/redirectMiddleware');
const googleMiddleware = require('../middlewares/googleMiddleware');

const router = express.Router();

router.get('/', authMiddleware, pageController.getIndexPage);
router.get('/login', redirectMiddleware, pageController.getLoginPage);
router.get('/register', redirectMiddleware, pageController.getRegisterPage);
router.get('/account', authMiddleware, pageController.getAccountPage);

module.exports = router;
