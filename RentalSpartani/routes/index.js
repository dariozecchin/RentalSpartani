var express = require('express');
var router = express.Router();
var app= express();
var db = require('../database');
const url = require('url');
var session = require('express-session');
var ssn;

// router.use(bodyParser.urlencoded({ extended: false }));

//gestione variabili di sessione
router.get('/', function(req, res){
  ssn = req.session;
  if(!ssn.loggedin)
    console.log("no session var")
  else
    console.log("Session var active")
  var sql = 'SELECT * FROM GUERRIERO';
  db.query(sql, function (err, data, fields) {
    res.render('index', { userData: data, sessionVar: ssn});
  });
});


//ricerca del guerriero
router.post('/submit-form', function(req, res){
  ssn = req.session;
  var periodo = String(req.body.daterange);
  var array = periodo.split("-");
  var dataIniziale = String(array[0]);

  var giorno = dataIniziale.substring(0,2);
  var mese = dataIniziale.substring(3,5);
  var anno = dataIniziale.substring(6,10);
  var dataInizio = anno + "-" + mese + "-" + giorno;

  var dataFinale = String(array[1]);
  var giorno1 = dataFinale.substring(0,2);
  var mese1 = dataFinale.substring(3,5);
  var anno1 = dataFinale.substring(6,10);
  var dataFinale1 = anno1 + "-" + mese1 + "-" + giorno1;

  var caratteristica = req.body.optradio;
  if(caratteristica == undefined){
    var q = 'SELECT Nome, Abilità,Prezzo FROM GUERRIERO WHERE Nome NOT IN (SELECT NomeGuerriero FROM PRENOTAZIONE WHERE DataInizio >= ("'+dataInizio+'") AND DataFine <= ("'+dataFinale1+'"))';
  } else {
    var q = 'SELECT Nome, Abilità,Prezzo FROM GUERRIERO WHERE Abilità = ("'+caratteristica+'") AND Nome NOT IN (SELECT NomeGuerriero FROM PRENOTAZIONE WHERE DataInizio >= ("'+dataInizio+'") AND DataFine <= ("'+dataFinale1+'"))';
  }
  db.query(q, function (err, elemento, fields) {
   res.render('index', { title: 'Index', userData: elemento, sessionVar: ssn});
 });
});

//login
router.post('/login', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
    db.query('SELECT * FROM utente WHERE StatoAccount <> "Non attivo" AND username = ? AND password = ?', [username, password], function(error, results, fields) {
      if (results.length > 0) {
        request.session.loggedin = true;
        request.session.username = username;
        request.session.accountType =results[0].Tipo;
        response.locals.username= username;
        response.locals.loggedin = true;
        ssn=request.session;
        response.redirect("/");
      } else {
        response.redirect('/?error=user_not_found')
      }
    });
	} else {
	response.send('Please enter Username and Password!');
	response.end();
	}
});


//logout
router.post('/logout', function(request, response) {
  request.session.destroy();
  response.redirect("/");
  response.end();
});

module.exports = router;
