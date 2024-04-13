const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const scopes = ['https://www.googleapis.com/auth/calendar.events'];

const calendar = google.calendar({
  version: 'v3',
  auth: process.env.API_KEY,
});

exports.authUrl = () => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  return url;
};

exports.authToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

exports.setCredentials = (tokens) => {
  oauth2Client.setCredentials(tokens);
};

exports.getEvents = async () => {
  return await calendar.events.list({
    calendarId: 'primary',
    auth: oauth2Client,
    maxResults: 2000,
    pageToken: '',
    singleEvents: true,
  });
};

exports.addEvent = async (event) => {
  const summary = event.title;
  const description = event.description ?? '';
  const start = event.start;
  const end = event.end;

  try {
    const event = await calendar.events.insert({
      calendarId: 'primary',
      auth: oauth2Client,
      requestBody: {
        summary,
        description,
        start: {
          date: start,
        },
        end: {
          date: end,
        },
        reminders: {
          useDefault: false,
          overrides: [],
        },
      },
    });

    return event.status == 200 ? event.data : false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.removeEvent = async (id) => {
  try {
    const event = await calendar.events.delete({
      auth: oauth2Client,
      calendarId: 'primary',
      eventId: id,
    });

    return event.status == 204 ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.updateEvent = async (event) => {
  const id = event.id;
  const summary = event.title;
  const description = event.description ?? '';
  const start = event.start;
  const end = event.end;

  try {
    const event = await calendar.events.patch({
      auth: oauth2Client,
      calendarId: 'primary',
      eventId: id,
      requestBody: {
        summary,
        description,
        start: {
          date: start,
        },
        end: {
          date: end,
        },
        reminders: {
          useDefault: false,
          overrides: [],
        },
      },
    });

    return event.status == 200 ? event.data : false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
