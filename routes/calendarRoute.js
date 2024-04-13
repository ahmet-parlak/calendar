const express = require('express');
const calendarController = require('../controllers/calendarController');
const authMiddleware = require('../middlewares/authMiddleware');
const googleMiddleware = require('../middlewares/googleMiddleware');
const eventValidator = require('../middlewares/validators/event');

const router = express.Router();

router.all('*', authMiddleware);

router.get('/google', calendarController.authGoogle);

router.get('/google-redirect', calendarController.authGoogleRedirect);

router.get('/events', googleMiddleware, calendarController.getEvents);

router.post(
  '/events',
  googleMiddleware,
  eventValidator,
  calendarController.addEvent
);

router.delete('/events/:id', googleMiddleware, calendarController.deleteEvent);

router.patch('/events/:id', googleMiddleware, eventValidator, calendarController.updateEvent);


module.exports = router;
