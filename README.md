# Calendar
[FullCalendar](https://fullcalendar.io/) and Google Calendar Integration with express.js and MongoDB

## Features
- User authentication
- Listing events
- Creating events
- Editing events
- Deleting events

## Getting Started
- Clone this repo: ```git clone https://github.com/ahmet-parlak/calendar```
- Install all required dependencies: ```npm install```
- Follow [these](https://developers.google.com/calendar/api/guides/overview) steps to create a Google Cloud project, then obtain the Client ID, Client secret, Redirect URL, and API Key information.
- Create a **.env** in the root directory and add following information :<br>(The values are assigned as examples. Customize them according to your own project.)
    - ```PORT = 4000```
    - ```MONGODB_URI = mongodb://localhost:27017/calendar-db```
    - ```MIN_PASS_LENGTH = 6```
    - ```CLIENT_ID = ***```
    - ```CLIENT_SECRET = ***```
    - ```REDIRECT_URL = http://localhost:4000/calendar/google-redirect```
    - ```API_KEY = ***```
- Start the local server by running: ```npm start```
- Start the local server with development mode by running: ```npm run dev```
