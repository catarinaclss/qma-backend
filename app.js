var createError = require('http-errors');
var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config/appConfig');
var passport = require('passport');
var bodyParser = require('body-parser');
const Docs = require('express-api-doc');



/**
 * Importing routes
 */
var studentRouter = require('./routes/student');
var authRouter = require('./routes/auth');
var allocationRouter = require('./routes/allocation');
var assistanceRouter = require('./routes/assistance');

var app = express();



/**
 * Enable Cors to allow interaction between different origins
 */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

/** 
 * View engine setup 
 * */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

/**
 * Connect to database
 */
mongoose.connect(config.MONGODB_URL || 
  'mongodb://localhost:27017/qmadb', {
  useNewUrlParser: true
});

require('./config/passport')(passport);

/**
 * Connecting to routes
 */
app.use('/student', studentRouter);
app.use('/auth', authRouter);
app.use('/allocation', allocationRouter);
app.use('/assistance', assistanceRouter);

/**
 * Catch 404 and forward to error handler
 * */ 
app.use(function(req, res, next) {
  next(createError(404));
});

/**
 * Error handler
 * */ 
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

const dock = new Docs(app);
dock.track({
    path:     './public/restdoc.html',
    examples: './public/apirest.txt', // responses and requests will save here
});

module.exports = app;
