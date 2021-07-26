var express = require('express');
var router = express.Router();
var db=require('../database');
var bodyParser = require('body-parser');

var ssn ;

router.use(bodyParser.urlencoded({ extended: true }));

//lancio della pagina con i dati presi dal db
router.get('/:id', function(req, res){
  ssn = req.session;
  var id = ssn.username;
  var c = "";
  var sql= 'SELECT * FROM UTENTE WHERE Username = "'+ id +'"';
  var t1 = 'SELECT * FROM PRENOTAZIONE JOIN GUERRIERO ON NomeGuerriero=Nome WHERE usernameUtente = "'+ id + '" AND DataInizio<CURDATE() AND DataRestituzione IS NULL';
  var t2 = 'SELECT * FROM PRENOTAZIONE JOIN GUERRIERO ON NomeGuerriero=Nome WHERE usernameUtente = "'+ id + '" AND DataFine>CURDATE() AND DataInizio>CURDATE()';
  var t3 = 'SELECT * FROM PRENOTAZIONE JOIN GUERRIERO ON NomeGuerriero=Nome WHERE usernameUtente = "'+ id + '" AND DataRestituzione IS NOT NULL';
  var t4 = 'SELECT * FROM GUERRIERO WHERE Stato<>"Deceduto"';
  var t5 = 'SELECT * FROM UTENTE';
  var t6 = 'SELECT * FROM PRENOTAZIONE JOIN GUERRIERO ON NomeGuerriero=Nome WHERE DataInizio<CURDATE() AND DataRestituzione IS NULL';
  var t7 = 'SELECT * FROM PRENOTAZIONE JOIN GUERRIERO ON NomeGuerriero=Nome WHERE DataFine>CURDATE() AND DataInizio>CURDATE()';
  var t8 = 'SELECT * FROM PRENOTAZIONE JOIN GUERRIERO ON NomeGuerriero=Nome WHERE DataRestituzione IS NOT NULL';
  db.query(sql, function (err, data, fields) {
    db.query(t1, function (err, result1, fields) {
      db.query(t2, function (err, result2, fields) {
        db.query(t3, function(err, result3, fields) {
          db.query(t4, function(err, result4, fields) {
            db.query(t5, function(err, result5, fields) {
              db.query(t6, function(err, result6, fields) {
                db.query(t7, function(err, result7, fields) {
                  db.query(t8, function(err, result8, fields) {
                    //se l'id è di un admin viene lanciata la pagina admin se cliente la pagina cliente
                    data.forEach((data, i) => {
                      if (data.Tipo=='Admin') {
                        c = "Admin";
                      } else {
                        c = "Customer";
                      }
                    });
                    if (c == 'Admin') {
                      res.render('adminpage', {rows4:result4, rows5:result5, rows6:result6, rows7:result7, rows8:result8 , sessionVar:ssn});
                    } else {
                      res.render('customerpage', {userData: data, rows1:result1, rows2:result2, rows3:result3, sessionVar:ssn });
                    }
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});


//aggiornamento dati personali da pagina cliente
router.post('/aggiorna_dati', function(req, res){
  ssn = req.session;
  var id = req.body.editid;
  var nomeData = "";
  var pwdData = "";
  var cittaData = "";
  var empty = "";
  var sql='SELECT * FROM UTENTE WHERE Username = "'+ id +'"';
  db.query(sql, function(err, data, fields) {
    if (err) throw err;
      data.forEach((data, i) => {
        nomeData = data.Nome;
        pwdData = data.Password;
        cittaData = data.Città;
    });
    if (req.body.editnome!=empty) {
      nomeData = req.body.editnome;
    }

    if (req.body.editpwd!=empty) {
      pwdData = req.body.editpwd;
    }

    if (req.body.editcittà!=empty) {
      cittaData = req.body.editcittà;
    }
    var q = 'UPDATE UTENTE SET Nome = "'+nomeData+'", Password = "'+pwdData+'", Città = "'+cittaData +'" WHERE Username = "'+id+'"';
    db.query(q, function (err, data, fields) {
      var risposta = "Riepilogo modifiche: username: "+id+" - nome: "+nomeData+" - password: "+pwdData+" - città: "+cittaData;
      var link = "/users/"+ssn.username;
      var arrayNot = [{id: link, frase1: "Modifica avvenuta con successo", frase2: risposta}];
      res.render('notify', { rows:arrayNot, sessionVar:ssn });
    });
  });
});

//estendere una prenotazione attiva da pagina cliente
router.post('/estendi', function(req, res) {
  ssn = req.session;
  var btn = req.body.btnid1;
  var id = String(req.body.estendid);
  var arId = id.split(",");
  var outCodice = arId[btn];

  var war1 = String(req.body.estendiWarrior);
  var arWar1 = war1.split(",");
  var outWar = arWar1[btn];

  var data1 = String(req.body.input_dataI);
  var arDa = data1.split(",");
  var outData = arDa[btn];
  var dt = new Date();
  var giorno = dt.getDate();
  var mese = dt.getMonth() + 1;
  var anno = dt.getFullYear();
  var oggi = 0;

  if(giorno < 10){
     giorno = "0" + giorno;
  }
  if(mese < 10){
    mese = "0" + mese;
  }

  oggi = anno + "-" + mese + "-" + giorno;
  var query1 = 'SELECT COUNT(*) AS conteggio1 FROM PRENOTAZIONE WHERE Codice<>'+outCodice+' AND NomeGuerriero = "'+outWar+'" AND "'+oggi+'" >= DataInizio AND "'+oggi+'" <= DataFine;';
  var query2 = 'SELECT COUNT(*) AS conteggio2 FROM PRENOTAZIONE WHERE Codice<>'+outCodice+' AND NomeGuerriero = "'+outWar+'" AND "'+outData+'" >= DataInizio AND "'+outData+'" <= DataFine;';
  var query3 = 'SELECT COUNT(*) AS conteggio3 FROM PRENOTAZIONE WHERE Codice<>'+outCodice+' AND NomeGuerriero = "'+outWar+'" AND "'+oggi+'" <= DataInizio AND "'+outData+'" >= DataFine;';
  var v1 = 0;
  var v2 = 0;
  var v3 = 0;
  db.query(query1, function (err, data1, fields) {
    db.query(query2, function (err, data2, fields) {
      db.query(query3, function (err, data3, fields) {
      v1 = data1[0].conteggio1;
      v2 = data2[0].conteggio2;
      v3 = data3[0].conteggio3;
      if(v1 != 0 || v2 != 0 || v3 != 0 || outData == ""){
        var arrayNot = [{id: link, frase1: "Prenotazione fallita", frase2:"Il periodo inserito non è disponibile"}];
        res.render('notify', { rows:arrayNot, sessionVar:ssn });
        } else {
          var risposta = "Il prestito terminerà in data: "+outData;
          var link = "/users/"+ssn.username;
          var arrayNot = [{id: link, frase1: "Modifica avvenuta con successo", frase2: risposta}];

          var q = 'UPDATE PRENOTAZIONE SET DataFine = "'+outData+'" WHERE Codice = "'+outCodice+'"';
          db.query(q, function (err, data, fields) {
            res.render('notify', { rows:arrayNot, sessionVar:ssn });
          });
        }
      });
    });
  });
});

//gestione tabella prenotazione attive e future per clienti e admin
router.post('/modifica', function(req, res) {
  ssn = req.session;
  //bottone per modificare date di prenotazione
  var btn1 = req.body.btnid2;
  //bottone con cancellare delle prenotazioni
  var btn2 = req.body.btnid3;
  //bottone con cui l'admin termina un prestito
  var btn4 = (req.body.btnid4-2);
  //modifica date
  if (btn1 != undefined) {
    var id1 = String(req.body.modificaid);
    var arId1 = id1.split(",");
    var outCodice1 = arId1[btn1];

    var war1 = String(req.body.modificawarrior);
    var arWar1 = war1.split(",");
    var nomeG1 = arWar1[btn1];

    var dataIdI1 = String(req.body.dataidI);
    var arDateIdI1 = dataIdI1.split(",");
    var dataInizioSQL = arDateIdI1[btn1];

    var dataIdF1 = String(req.body.dataidF);
    var arDateIdF1 = dataIdF1.split(",");
    var dataFineSQL = arDateIdF1[btn1];

    var link = "/users/"+ssn.username;

    var query1 = 'SELECT COUNT(*) AS conteggio1 FROM PRENOTAZIONE WHERE Codice<>'+outCodice1+' AND NomeGuerriero = "'+nomeG1+'" AND "'+dataInizioSQL+'" >= DataInizio AND "'+dataInizioSQL+'" <= DataFine;';
    var query2 = 'SELECT COUNT(*) AS conteggio2 FROM PRENOTAZIONE WHERE Codice<>'+outCodice1+' AND NomeGuerriero = "'+nomeG1+'" AND "'+dataFineSQL+'" >= DataInizio AND "'+dataFineSQL+'" <= DataFine;';
    var query3 = 'SELECT COUNT(*) AS conteggio3 FROM PRENOTAZIONE WHERE Codice<>'+outCodice1+' AND NomeGuerriero = "'+nomeG1+'" AND "'+dataInizioSQL+'" <= DataInizio AND "'+dataFineSQL+'" >= DataFine;';
    var query4 = 'SELECT * FROM PRENOTAZIONE WHERE NomeGuerriero = "'+nomeG1+'"';
    var v1 = 0;
    var v2 = 0;
    var v3 = 0;
    db.query(query1, function (err, data11, fields) {
      db.query(query2, function (err, data12, fields) {
        db.query(query3, function (err, data13, fields) {
          db.query(query4, function (err, data14, fields) {
            v1 = data11[0].conteggio1;
            v2 = data12[0].conteggio2;
            v3 = data13[0].conteggio3;
            var stringaPeriodi = "Periodi già prenotati: ";
            for (var i = 0; i < data14.length; i++) {
              var dInizio = String(data14[i].DataInizio);
              var dataIsub = dInizio.substring(4,15);
              var dFine = String(data14[i].DataFine);
              var dataFsub = dFine.substring(4,15);
              stringaPeriodi = stringaPeriodi.concat(dataIsub);
              stringaPeriodi = stringaPeriodi.concat("-");
              stringaPeriodi = stringaPeriodi.concat(dataFsub);
              if (i!=(data14.length-1)){
                stringaPeriodi = stringaPeriodi.concat('<==>');
              }
            }
            if(v1 != 0 || v2 != 0 || v3 != 0 || dataInizioSQL == "" || dataFineSQL == ""){
              var arrayNot = [{id: link, frase1: "Prenotazione fallita. Il periodo scelto non è disponibile", frase2:stringaPeriodi}];
              res.render('notify', { rows:arrayNot, sessionVar:ssn });
            } else {
              var risposta = "Nuovo periodo di prenotazione: "+dataInizioSQL+" - "+dataFineSQL;
              var arrayNot = [{id: link, frase1: "Update avvenuto con successo", frase2: risposta}];
              var q1 = 'UPDATE PRENOTAZIONE SET DataInizio = "'+dataInizioSQL+'", DataFine= "'+dataFineSQL+'" WHERE Codice = '+outCodice1;
              db.query(q1, function (err, data1, fields) {
                res.render('notify', { rows:arrayNot, sessionVar:ssn });
              });  
            }
          });
        });
      });
    });
  }
  //eliminazione di una prenotazione
  else if (btn2!=undefined ) {
    var idE = String(req.body.modificaid);
    var arIdE = idE.split(",");
    var outCodiceE = arIdE[btn2];

    var risposta = "La prenotazione selezionata è stata rimossa dall'elenco delle prenotazioni";
    var link = "/users/"+ssn.username;
    var arrayNot = [{id: link, frase1: "Eliminazione avvenuta con successo", frase2: risposta}];

    var q2 = 'DELETE FROM PRENOTAZIONE WHERE Codice = "'+outCodiceE+'"';
    db.query(q2, function (err, data2, fields) {
      res.render('notify', { rows:arrayNot, sessionVar:ssn });
    });
  }
  //fine prestito
  else if(btn4!=undefined){
    var idR = String(req.body.modificaid);
    var arIdR = idR.split(",");
    var outCodiceR = arIdR[btn4];

    var dateR = String(new Date());
    var dataOutput = dateR.substring(0,15);
    var stateChange= req.body.selectCondition;

    if (stateChange!="false") {
      var q3 = 'CALL FinePrestito("'+outCodiceR+'")';
      var q4 = 'CALL PenaliInfortuni("'+stateChange+'", "'+outCodiceR+'")';
      db.query(q4, function (err, data44, fields) {
        db.query(q3, function (err, data22, fields) {
          var risposta = "La prenotazione è terminata in data odierna "+dataOutput;
          var link = "/users/"+ssn.username;
          var arrayNot = [{id: link, frase1: "Update avvenuto con successo", frase2: risposta}];
          res.render('notify', { rows:arrayNot, sessionVar:ssn });
        });
      });
    } else {
      var q3 = 'CALL FinePrestito("'+outCodiceR+'")';
      var risposta = "La prenotazione è terminata in data odierna "+dataOutput;
      var link = "/users/"+ssn.username;
      var arrayNot = [{id: link, frase1: "Operazione avvenuta con successo", frase2: risposta}];
      db.query(q3, function (err, data2, fields) {
        res.render('notify', { rows:arrayNot, sessionVar:ssn });
      });
    }
  }
});

//modifica di un utente dalla pagina admin
router.post('/edit_users', function(req, res){
  ssn = req.session;
  //modifica dati
  var button = req.body.editid;
  //account non attivo
  var button2 = req.body.deleteid;
  //modifica dati
  if (button != undefined) {
    var us = String(req.body.userid);
    var arUs = us.split(",");
    var user = arUs[button];

    var name = String(req.body.editname);
    var arName = name.split(",");
    var nome = arName[button];

    var account = req.body.editaccount;
    var citta = String(req.body.editcity);
    var arCitta = citta.split(",");
    var city = arCitta[button];

    var nomeData = "";
    var pwdData = "";
    var cittaData = "";
    var empty = "";

    var sql='SELECT * FROM UTENTE WHERE Username = "'+ user +'"';
    db.query(sql, function(err, data, fields) {
      data.forEach((data, i) => {
        nomeData = data.Nome;
        pwdData = data.Password;
        cittaData = data.Città;
        statoData = data.StatoAccount;
      });
      if (nome!=empty) {
        nomeData = nome;
      }
      if (city!=empty) {
        cittaData = city;
      }
      if (account!=undefined) {
        statoData = account;
      }
      var risposta = "Riepilogo: username: "+user+" - nome: "+nomeData+" - città: "+cittaData;
      var link = "/users/"+ssn.username;
      var arrayNot = [{id: link, frase1: "Modifica avvenuta con successo", frase2: risposta}];

      var q = 'UPDATE UTENTE SET Nome = "'+nomeData+'", Città = "'+cittaData +'", StatoAccount="'+statoData+'" WHERE Username = "'+user+'"';
      db.query(q, function (err, data, fields) {
        res.render('notify', { rows:arrayNot, sessionVar:ssn });
      });
    });
  //disattivazione account
  } else if (button2 != undefined) {
    var us2 = String(req.body.userid);
    var arUs2 = us2.split(",");
    var user2 = arUs2[button2];
    var q = 'UPDATE UTENTE SET StatoAccount="Non attivo" WHERE Username="'+user2+'"';

    var risposta = "L'account dell'utente "+user2+" è stato disattivato";
    var link = "/users/"+ssn.username;
    var arrayNot = [{id: link, frase1: "Cancellazione avvenuta con successo", frase2: risposta}];

    db.query(q, function (err, data, fields) {
        res.render('notify', { rows:arrayNot, sessionVar:ssn });
    });
  }
});

//modifica di un guerriero dalla pagina admin
router.post('/edit_warriors', function(req, res){
  ssn=req.session;
  //bottone che lancia l'aggiornamento dei dati
  var button = req.body.editidw;
  //bottone che rende non disponibile un guerriero
  var button2 = req.body.deleteidw;
  //modifica dati
  if (button != undefined) {
    var name = String(req.body.editnome);
    var arName = name.split(",");
    var nome = arName[button];

    var year = String(req.body.annomod);
    var arYear = year.split(",");
    var anno = arYear[button];

    var heigth = String(req.body.altezzamod);
    var arHeight = heigth.split(",");
    var altezza = arHeight[button];

    var weight = String(req.body.pesomod);
    var arWeight = weight.split(",");
    var peso = arWeight[button];

    var stato = req.body.statomod;
    var abilita = req.body.abimod;

    var price = String(req.body.prezzomod);
    var arPrice = price.split(",");
    var prezzo = arPrice[button];

    var descr = String(req.body.descrmod);
    var arDescr = descr.split(",");
    var descrizione = arDescr[button];

    var annoData = "";
    var altezzaData = "";
    var pesoData = "";
    var statoData = "";
    var abilitaData = "";
    var prezzoData = "";
    var descrData = "";
    var empty = "";

    var sql='SELECT * FROM GUERRIERO WHERE Nome = "'+ nome +'"';
    db.query(sql, function(err, data, fields) {
      data.forEach((data, i) => {
        annoData = data.AnnoNascita;
        altezzaData = data.Altezza;
        pesoData = data.Peso;
        statoData = data.Stato;
        abilitaData = data.Abilità;
        prezzoData = data.Prezzo;
        descrData = data.Descrizione;
      });
      if (anno!=empty) {
        annoData = anno;
      }
      if (altezza!=empty) {
        altezzaData = altezza;
      }
      if (peso!=empty) {
        pesoData = peso;
      }
      if (stato != undefined) {
        statoData = stato;
      }
      if (abilita !=undefined) {
        abilitaData = abilita;
      }
      if (prezzo != empty) {
        prezzoData = prezzo;
      }
      if (descrizione!=empty) {
        descrData = descrizione;
      }
      var risposta = "Riepilogo: nome: "+nome+" - anno: "+annoData+" - altezza: "+altezzaData+" - peso: "+pesoData+" - stato fisico: "+statoData+" - abilità: "+abilitaData+" - descrizione: "+descrData+" - prezzo: "+prezzoData;
      var link = "/users/"+ssn.username;
      var arrayNot = [{id: link, frase1: "Update avvenuto con successo", frase2: risposta}];

      var q = 'UPDATE GUERRIERO SET AnnoNascita="'+annoData+'", Altezza="'+altezzaData +'", Peso="'+pesoData+'", Stato="'+statoData+'", Abilità="'+abilitaData+'", Descrizione="'+descrData+'", Prezzo="'+prezzoData+'" WHERE Nome="'+nome+'"';
      var risposta = "Modifica avvenuta con successo";
      db.query(q, function (err, data, fields) {
        res.render('notify', { rows:arrayNot, sessionVar:ssn });
      });
    });
  //guerriero non disponibile
  } else if (button2 != undefined) {
    var name2 = String(req.body.editnome);
    var arname2 = name2.split(",");
    var nome2 = arname2[button2];

    var risposta = "Il guerriero "+nome2+ " non è più disponibile";
    var link = "/users/"+ssn.username;
    var arrayNot = [{id: link, frase1: "Operazione avvenuta con successo", frase2: risposta}];
    var q = 'UPDATE GUERRIERO SET Stato="Non disponibile" WHERE Nome="'+nome2+'"';
    db.query(q, function (err, data, fields) {
      res.render('notify', { rows:arrayNot, sessionVar:ssn });
    });
  }
});

//inserimento di un nuovo guerriero pagina admin
router.post('/newWarrior', function(req, res) {
  ssn = req.session;
  var name = req.body.input_namew;
  var height = req.body.input_heightw;
  var weight = req.body.input_weightw;
  var year = req.body.input_yearw;
  var stato = req.body.input_statow;
  var abilità = req.body.input_abilitaw;
  var foto = req.body.input_photow;
  var descr = req.body.input_descrw;

  var link = "/users/"+ssn.username;
  var risposta = "Inserimento del guerriero "+name+" fallito";

  var pho = foto.split(".");

  var q1 = 'SELECT COUNT(*) AS Cguerr FROM GUERRIERO WHERE Nome = "'+name+'"';
  var valore = 0;
  db.query(q1, function (err, data1, fields) {
    valore = data1[0].Cguerr;
    if (valore==1) {
      var arrayNot = [{id: link, frase1: "Errore nell'inserimento del nome del guerriero. Il nome è già presente nel sistema", frase2: risposta}];
      res.render('notify', { rows:arrayNot, sessionVar:ssn});
    } else if (pho[1]!="png") {
      var arrayNot = [{id: link, frase1: "Errore nell'inserimento della foto, devi usare un'immagine .png", frase2: risposta}];
      res.render('notify', { rows:arrayNot, sessionVar:ssn });
    } else {
      var risposta = "Riepilogo guerriero: nome: "+name+" - anno: "+year+" - altezza: "+height+" - peso: "+weight+" - stato fisico: "+stato+" - abilità: "+abilità;
      var link = "/users/"+ssn.username;
      var arrayNot = [{id: link, frase1: "Inserimento avvenuto con successo", frase2: risposta}];

      var q = 'INSERT INTO GUERRIERO VALUES ("'+name+'","'+year+'", "'+height+'", "'+weight+'", "'+stato+'", 0, "'+abilità+'", "'+descr+'", "'+foto+'", 100, 0)';
      db.query(q, function (err, data, fields) {
        res.render('notify', { rows:arrayNot, sessionVar:ssn });
      });
    }
  });
});

//inserimento di un nuovo utente da pagina admin
router.post('/newUser', function(req, res) {
  ssn = req.session;
  var username = req.body.username;
  var name = req.body.name;
  var password = req.body.password;
  var city = req.body.city;
  var typeAccount = req.body.typeUtent;
  var nPre = 0;
  var statoA = 'Attivo';

  var link = "/users/"+ssn.username;

  var q1 = 'SELECT COUNT(*) AS conteggio FROM UTENTE WHERE Username = "'+username+'"';
  var valore = 0;
  db.query(q1, function (err, data1, fields) {
    valore = data1[0].conteggio;
    if(valore == 1){
      var arrayNot = [{id: link, frase1: "Inserimento del nuovo utente fallito perchè il nome che hai digitato è già esistente", frase2: "Riprova con un altro nome"}];
      res.render('notify', { rows:arrayNot, sessionVar:ssn});
    } else {
      var q = 'INSERT INTO UTENTE VALUES ("'+username+'","'+name+'", "'+password+'","'+city+'","'+typeAccount+'",'+nPre+', "'+statoA+'")';
      db.query(q, function (err, data, fields) {
        var risposta = "Riepilogo utente: username: "+username+" - nome: "+name+" - password: "+password+" - città: "+city+" - tipo account: "+typeAccount;
        var arrayNot = [{id: link, frase1: "Inserimento del nuovo utente terminato in modo corretto", frase2: risposta}];
        res.render('notify', { rows:arrayNot, sessionVar:ssn });
      });
    }
  });
});

//operazioni tabella storico noleggi
router.post('/fattura', function(req, res) {
    ssn = req.session;
    //bottone per vedere la fattura di una prenotazione
    var button = req.body.button_fattura;
    //bottone per scrivere una recensione da pagina cliente
    var button1 = parseInt(req.body.buttonMR);
    //vedi fattura
    if (button!=undefined) {
      var x = String(req.body.codice_fattura);
      var arX = x.split(",");
      var codice = arX[button];
      q1 = 'SELECT * FROM FATTURA WHERE CodicePrenotazione="'+codice+'"';
      q2 = 'SELECT * FROM PRENOTAZIONE JOIN UTENTE ON UsernameUtente=Username WHERE Codice="'+codice+'"';
      db.query(q1, function (err, result1, fields) {
        db.query(q2, function (err, result2, fields) {
          res.render('fattura', { rows1:result1, rows2:result2, sessionVar:ssn });
        });
      });
    //scrivi recensione
    } else if (button1!=undefined) {
    var x = String(req.body.guerrieroR);
    var arX = x.split(",");
    var guerriero = arX[button1];
    var titolo = req.body.titoloR;
    var testo = req.body.inputRecensione;

    var stelle = req.body.starRating;
    if (stelle==undefined) {
      stelle=1 ;
      }
    var dt = new Date();
    var giorno = dt.getDate();
    var mese = dt.getMonth() + 1;
    var anno = dt.getFullYear();
    var oggi = 0;
    if(giorno < 10){
      giorno = "0" + giorno;
    }
    if(mese < 10){
      mese = "0" + mese;
    }
    oggi = anno + "-" + mese + "-" + giorno;

    q1 = 'INSERT INTO RECENSIONE(Utente, Stelle, DataR, NomeGuerriero, Titolo, Testo) VALUES("'+ssn.username+'", "'+stelle+'", "'+oggi+'", "'+guerriero+'", "'+titolo+'", "'+testo+'")';
    db.query(q1, function (err, result1, fields) {
      var risposta = "Riepilogo: titolo: "+titolo+" - testo: "+testo+" - stelle: "+stelle;
      var arrayNot = [{id: "link", frase1: "Recensione pubblicata", frase2: risposta}];
      res.render('notify', { rows:arrayNot, sessionVar:ssn });
    });
  }
});

//logout
router.post('/logout', function(request, response) {
  request.session.destroy();
  response.redirect("/");
  response.end();
});

module.exports = router;
