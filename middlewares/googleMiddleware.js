const User = require('../models/User');
const googleService = require('../services/googleCalendarService');

module.exports = (req, res, next) => {
  User.findById(req.session.user?.id)
    .then((user) => {
      if (!user.googleToken) return res.redirect('/calendar/google');
      googleService.setCredentials(user.googleToken);

      next();
    })
    .catch((err) => {
      console.log(err);
      return res.send('Something went wrong');
    });
};
