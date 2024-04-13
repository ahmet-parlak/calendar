const bcrypt = require('bcrypt');
const { getValidationErrors } = require('../helpers/validator');

const User = require('../models/User');

exports.register = (req, res) => {
  const validationErrs = getValidationErrors(req);

  if (validationErrs.length > 0) {
    req.flash('registerErrors', validationErrs);
    req.flash('registerOldValues', req.body);
    return res.redirect('/register');
  }

  User.create(req.body)
    .then(() => {
      req.flash(
        'success',
        'You have successfully registered. You can log in with your email or username and password.'
      );
      res.redirect('/login');
    })
    .catch(() => {
      req.flash('registerErrors', ['Somethings wrong. Please try again.']);
      res.redirect('/register');
    });
};

exports.login = (req, res) => {
  const validationErrs = getValidationErrors(req);

  if (validationErrs.length > 0) {
    req.flash('loginErrors', validationErrs);
    req.flash('loginOldValues', req.body);
    return res.redirect('/login');
  }

  const userInput = req.body.email;
  const password = req.body.password;

  User.findOne({ $or: [{ email: userInput }, { username: userInput }] })
    .then((user) => {
      bcrypt.compare(password, user.password).then((isCorrect) => {
        if (isCorrect) {
          req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            googleToken: user.googleToken,
          };

          req.flash('success', 'Login successful');
          return res.redirect('/');
        }

        req.flash('loginErrors', ['User and password do not match!']);
        req.flash('loginOldValues', req.body);
        return res.redirect('/login');
      });
    })
    .catch((err) => {
      req.flash('loginErrors', ['User and password do not match!']);
      req.flash('loginOldValues', req.body);
      return res.redirect('/login');
    });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login?success=You have been successfully logged out.');
  });
};

exports.changePassword = async (req, res) => {
  const validationErrs = getValidationErrors(req);

  if (validationErrs.length > 0) {
    const data = {
      status: 'error',
      error_messages: validationErrs,
    };

    return res.status(400).send(data);
  }

  const user = await User.findOne({ email: global.User.email });

  if (user) {
    try {
      user.password = req.body.password;

      user.save();

      const data = {
        status: 'success',
        error_messages: [],
      };
      res.send(data);
    } catch (error) {
      console.log(error);
      const data = {
        status: 'error',
        error_messages: ['Something wrong!'],
      };
      res.send(data);
    }
  } else {
    const data = {
      status: 'error',
      error_messages: ['Something wrong!'],
    };
    res.send(data);
  }
};
