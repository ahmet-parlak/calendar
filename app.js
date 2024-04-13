const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
require('dotenv').config();
const flash = require('connect-flash');

const pageRouter = require('./routes/pageRoute');
const authRouter = require('./routes/authRoute');
const calendarRouter = require('./routes/calendarRoute');

//DB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log(`✔️  MongoDB connection is successful`))
  .catch((err) => console.log(`❌ MongoDB connection is failed\n${err}`));

//Express
const app = express();

//Configration
app.set('view engine', 'ejs');

//GLOBAL VARIABLES
global.User = null;

//Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: 'my_keyboard_cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  })
);
app.use(methodOverride('_method', { methods: ['GET', 'POST'] }));
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

//Routes
app.use('*', (req, res, next) => {
  User = req.session.user;
  next();
});
app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/calendar', calendarRouter);

app.use((req, res) => {
  res.status(404).render('404');
});

//Listen
const port = process.env.PORT ?? 5000;
app.listen(port, () => console.log(`🚀 The server running at port ${port}`));
