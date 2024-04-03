const User = require('../models/User');

module.exports = (req, res, next) => {
  User.findById(req.session.user?.id)
    .then((user) => {
      if (!user) return res.status(401).redirect('/login');

      next();
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).redirect('/login');
    });
};
