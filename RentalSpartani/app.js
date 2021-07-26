var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var bodyParser = require("body-parser");
var statisticheRouter = require('./routes/statistiche');
var registerRouter = require('./routes/register');
var contattiRouter = require('./routes/contatti')


var app = express();

// aggiunte per il login
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.use('/statistiche', statisticheRouter);
app.use('/register', registerRouter);
app.use('/contatti', contattiRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter);


app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
//comando per usare i file statici
app.use(express.static(__dirname + '/public'));
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
