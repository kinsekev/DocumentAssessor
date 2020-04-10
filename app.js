const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const session = require('express-session');
const Researcher = require('./models/researcher');
const methodOverride = require('method-override');
const seedUserDB = require('./seeds/users');

// require routes
const indexRouter = require('./routes/index');
const researchersRouter = require('./routes/researchers');
const assessmentsRouter = require('./routes/assessments');

const app = express();

// connect to the database
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/assessments', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('we\'re connected!');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// configure passport and sessions
app.use(session({
  secret: 'cs615 project',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Researcher.authenticate()));
passport.use(Researcher.createStrategy());
passport.serializeUser(Researcher.serializeUser());
passport.deserializeUser(Researcher.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// mount routes
app.use('/', indexRouter);
app.use('/researchers', researchersRouter);
app.use('/assessments', assessmentsRouter);

// mock users
seedUserDB();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;