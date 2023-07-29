var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const envFile = process.env.NODE_ENV ? `./.env.${process.env.NODE_ENV}` : './.env'
require('dotenv').config({ path: envFile });

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var db = require('./createDB');

//middleware check if collection exists
app.use('/:collection', (req, res, next) => {
  if(!(req.params.collection in db.schema.tables)) return res.status(500).send({msg: "Requested collection doesn't exists in database"});
  else next();
})
app.use('/:collection/:id', (req, res, next) => {
  if(!(req.params.collection in db.schema.tables)) return res.status(500).send({msg: "Requested collection doesn't exists in database"});
  else next();
})
app.use('/', indexRouter);
app.use(function(req, res, next) {
  res.on("finish", function() {
      db.closeConn();
  });

  next();
});

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
