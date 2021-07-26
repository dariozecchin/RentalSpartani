
var express = require('express');
var router = express.Router();
var db=require('../database');
var bodyParser = require('body-parser');

var ssn;

router.use(bodyParser.urlencoded({ extended: true }));

//lancio pagina della registrazione
router.get('/register', function(req, res){
  ssn = req.session;
  res.render('register', { sessionVar:ssn});
});

//registrazione di un account nel sistema
router.post('/register', function(req, res) {
  //variabili di sessione
  var username = req.body.username;
  req.session.loggedin = true;
  req.session.username = username;
  req.session.accountType = "Customer";
  ssn = req.session;
  
  var name = req.body.name;
  var password = req.body.password;
  var city = req.body.city;
  var nPre = 0;
  //controllo che l'username non sia già usato
  var v1 = 0;
  var q2 = 'SELECT COUNT(*) AS Conteggio FROM UTENTE WHERE Username="'+username+'"';
  db.query(q2, function (err, data2, fields) {
    v1 = data2[0].Conteggio;
    if (v1!=0) {
      var risposta = "Lo username scelto è già presente nel sistema. Si prega di sceglierne un altro";
      var link = "/register/register";
      var arrayNot = [{id: link, frase1: "Operazione di registrazione fallita", frase2: risposta}];
      res.render('notify', { rows:arrayNot, sessionVar:ssn});
    } else {
      //inserimento nel db
      var risposta = "Riepilogo utente: username: "+username+" - nome: "+name+" - città: "+city;
      var link = "/";
      var arrayNot = [{id: link, frase1: "Insert avvenuto con successo", frase2: risposta}];
      var q = 'INSERT INTO UTENTE VALUES ("'+username+'","'+name+'", "'+password+'","'+city+'","Customer",'+nPre+', "Attivo")';
      db.query(q, function (err, data, fields) {
        res.render('notify', { rows:arrayNot, sessionVar:ssn});
      });
    }
  });
});

//login
router.post('/login', function(request, response) {
  var username = request.body.username;
  var password = request.body.password;
  if (username && password) {
    db.query('SELECT * FROM utente WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
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
