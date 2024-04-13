const calendarService = require('../services/googleCalendarService');
const fullcalendarHelper = require('../helpers/fullcalendar');

exports.getIndexPage = (req, res) => {
  res.status(200).render('index');
};

exports.getLoginPage = (req, res) => {
  res.status(200).render('login');
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render('register');
};

exports.getAccountPage = (req, res) => {
  res.status(200).render('account');
};
