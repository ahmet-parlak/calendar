const express = require('express');
const pageController = require('../controllers/pageController');
const authMiddleware = require('../middlewares/authMiddleware');
const redirectMiddleware = require('../middlewares/redirectMiddleware');

const router = express.Router();

router.get('/', pageController.getIndexPage);
router.get('/login', pageController.getLoginPage);
router.get('/register', pageController.getRegisterPage);

module.exports = router;
