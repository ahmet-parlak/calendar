const calendarService = require('../services/googleCalendarService');
const User = require('../models/User');
const { response } = require('express');
const { getValidationErrors } = require('../helpers/validator');
const fullcalendarHelper = require('../helpers/fullcalendar');

exports.authGoogle = (req, res) => {
  const url = calendarService.authUrl();
  const data = {
    status: 302,
    redirect_url: url,
  };
  res.status(302).send(data);
};

exports.authGoogleRedirect = async (req, res) => {
  try {
    const code = req.query.code;

    const tokens = await calendarService.authToken(code);

    const user = await User.findById(req.session.user.id);
    user.googleToken = tokens;
    await user.save();
    req.session.user.googleToken = tokens;
    req.flash('success', 'You have successfully Google Authenticate.');
    res.redirect('/');
  } catch (error) {
    console.log(error);
    req.flash('errors', ['Somethings wrong. Please try again.']);
    res.send('Somethings wrong. Please try again.');
  }
};

exports.getEvents = (req, res) => {
  calendarService
    .getEvents()
    .then((eventsData) => {
      const events = fullcalendarHelper.convertGoogleCalendarEvents(eventsData);

      const data = {
        status: 'success',
        events,
      };
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ status: 'error', events: [] });
    });
};

exports.addEvent = async (req, res) => {
  const validationErrs = getValidationErrors(req);
  if (validationErrs.length > 0) {
    const responseData = {
      status: 'error',
      error_type: 'validation error',
      error_messages: validationErrs,
      old_values: req.body,
    };

    return res.status(400).send(JSON.stringify(responseData));
  }

  const eventData = {
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    description: req.body.description ?? '',
  };
  const event = await calendarService.addEvent(eventData);
  if (event) {
    const createdEvent = {
      id: event.id,
      title: event.summary,
      description: event.description,
      start: event.start?.date ?? event.start?.dateTime,
      end: event.end?.date ?? event.end?.dateTime,
    };
    res.status(201).send({ status: 'success', event: createdEvent });
  } else {
    res.status(400).send(`Something wrong`);
  }
};

exports.deleteEvent = (req, res) => {
  id = req.params?.id ?? null;

  if (id == null) return res.status(400).send('Bad request');

  calendarService
    .removeEvent(id)
    .then((status) => {
      status ? res.status(204).send() : res.status(400).send();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send();
    });
};

exports.updateEvent = async (req, res) => {
  const validationErrs = getValidationErrors(req);
  if (validationErrs.length > 0) {
    const responseData = {
      status: 'error',
      error_type: 'validation error',
      error_messages: validationErrs,
      old_values: req.body,
    };

    return res.status(400).send(JSON.stringify(responseData));
  }

  const eventData = {
    id: req.params.id,
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    description: req.body.description ?? '',
  };
  const event = await calendarService.updateEvent(eventData);
  if (event) {
    const updatedEvent = {
      id: event.id,
      title: event.summary,
      description: event.description,
      start: event.start?.date ?? event.start?.dateTime,
      end: event.end?.date ?? event.end?.dateTime,
    };
    res.status(200).send({ status: 'success', event: updatedEvent });
  } else {
    res.status(400).send(`Something wrong`);
  }
};
