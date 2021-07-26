var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db=require('../database');
var ssn;

router.use(bodyParser.urlencoded({ extended: true }));

//lancio della pagina prendendo i dati dal db
router.get('/:id', function(req, res){
  ssn = req.session;
  var id = req.params.id;
  var q1 = 'SELECT * FROM GUERRIERO WHERE Nome = "'+ id + '"';
  var q2 = 'SELECT * FROM PRENOTAZIONE WHERE NomeGuerriero = "'+ id + '"';
  var q3 = 'SELECT * FROM RECENSIONE WHERE NomeGuerriero = "'+ id + '"';
  var q4 = 'SELECT * FROM PRENOTAZIONE WHERE NomeGuerriero = "'+id+'" AND DataFine>CURDATE() ORDER BY DataInizio ASC';
  var q5 = 'SELECT * FROM UTENTE WHERE Username="'+ssn.username+'"';
  db.query(q1, function(err, result1) {
    db.query(q2, function(err, result2) {
      db.query(q3, function(err, result3) {
        db.query(q4, function(err, result4) {
          db.query(q5, function(err, result5) {
            res.render('productpage', { rows1 : result1, rows2: result2, rows3: result3, rows4:result4, rows5:result5, sessionVar:ssn});
          });
        });
      });
    });
  });
});

//prenotazione
router.post('/submit-form', function(req, res){
  ssn = req.session;
  var periodo = req.body.daterange1;
  var nome = req.body.nome;
  var chk = req.body.insurance;
  var variabileData = String(periodo);
  var dataInizio = variabileData.substring(0,10);
  var dataFine = variabileData.substring(13);
  var linea = "-";
  var insurance = "";
  if (chk) {
    chk=1;
    insurance="Sì";
  } else{
    chk=0;
    insurance="No";
  }
  var annoI = dataInizio.substring(6);
  var meseI = dataInizio.substring(3,5);
  var giornoI = dataInizio.substring(0,2);
  var dataInizioSQL = annoI.concat(linea, meseI, linea, giornoI);

  var annoF = dataFine.substring(6);
  var meseF = dataFine.substring(3,5);
  var giornoF = dataFine.substring(0,2);
  var dataFineSQL = annoF.concat(linea, meseF, linea, giornoF);

  var ppn = 0;
  var nrPren = req.body.nrPren;
  if (nrPren%10==0) {
    ppn = 1;
  }
  var link = "/product/"+nome;
  //controllo date
  var query1 = 'SELECT COUNT(*) AS conteggio1 FROM PRENOTAZIONE WHERE NomeGuerriero = "'+nome+'" AND "'+dataInizioSQL+'" >= DataInizio AND "'+dataInizioSQL+'" <= DataFine;'
  var query2 = 'SELECT COUNT(*) AS conteggio2 FROM PRENOTAZIONE WHERE NomeGuerriero = "'+nome+'" AND "'+dataFineSQL+'" >= DataInizio AND "'+dataFineSQL+'" <= DataFine;'
  var query3 = 'SELECT COUNT(*) AS conteggio3 FROM PRENOTAZIONE WHERE NomeGuerriero = "'+nome+'" AND "'+dataInizioSQL+'" <= DataInizio AND "'+dataFineSQL+'" >= DataFine;';
  var v1 = 0;
  var v2 = 0;
  var v3 = 0;
    db.query(query1, function (err, data1, fields) {
      db.query(query2, function (err, data2, fields) {
        db.query(query3, function (err, data3, fields) {
        v1 = data1[0].conteggio1;
        v2 = data2[0].conteggio2;
        v3 = data3[0].conteggio3;
        if(v1 != 0 || v2 != 0 | v3 != 0){
          var str = "Nel periodo inserito il guerriero non è disponibile";
          var arrayNot = [{id: link, frase1: "Prenotazione fallita", frase2:str}];
          res.render('notify', { rows:arrayNot, sessionVar:ssn });
        } else {
          var q = 'CALL PrenotaGuerriero("'+nome+'", "'+dataInizioSQL+'", "'+dataFineSQL+'", "'+chk+'", "'+ssn.username+'", "'+ppn+'")';
          db.query(q, function (err, data, fields) {
            var str = "Riepilogo prenotazione: Guerriero: "+nome+", periodo: "+dataInizioSQL+"-"+dataFineSQL+", assicurazione: "+insurance;
            var arrayNot = [{id: link, frase1: "Prenotazione avvenuta con successo", frase2:str}];
            res.render('notify', { rows:arrayNot, sessionVar:ssn });
          });
        }
      });
    });
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
        response.redirect("back");
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
  response.redirect("back");  
  response.end();
});



module.exports = router;


