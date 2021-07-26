var express = require('express');
var router = express.Router();
var db = require('../database');
var bodyParser = require("body-parser");

//lancio della pagina prendendo dal db i dati
router.get('/', function(req, res){
    ssn=req.session;
    var sql = 'SELECT COUNT(*) AS c FROM GUERRIERO';
    var sql1 = 'SELECT COUNT(*) AS c1 FROM GUERRIERO WHERE Abilità = "Corpo a corpo";'
    var sql2 = 'SELECT COUNT(*) AS c2 FROM GUERRIERO WHERE Abilità = "Grosso";'
    var sql3 = 'SELECT Nome FROM GUERRIERO WHERE NrBattaglie IN (SELECT MAX(NrBattaglie) FROM GUERRIERO) LIMIT 3;'
    var sql4 = 'SELECT COUNT(*) AS c3 FROM GUERRIERO WHERE Abilità = "Distanza";'
    var sql5 = 'SELECT COUNT(*) AS c4 FROM GUERRIERO WHERE Abilità = "Lancia";'
    // altezze
    var sql6 = 'SELECT AVG(Altezza) AS a1 FROM GUERRIERO WHERE Abilità = "Grosso";'
    var sql7 = 'SELECT AVG(Altezza) AS a2 FROM GUERRIERO WHERE Abilità = "Lancia";'
    var sql8 = 'SELECT AVG(Altezza) AS a3 FROM GUERRIERO WHERE Abilità = "Distanza";'
    var sql9 = 'SELECT AVG(Altezza) AS a4 FROM GUERRIERO WHERE Abilità = "Corpo a corpo";'
    var sql10 = 'SELECT Nome AS N, Abilità AS A, NrBattaglie AS NB FROM GUERRIERO WHERE Nome IN (SELECT NomeGuerriero FROM PRENOTAZIONE GROUP BY NomeGuerriero HAVING COUNT(*) = ( SELECT COUNT(*) FROM PRENOTAZIONE GROUP BY NomeGuerriero ORDER BY COUNT(*) DESC LIMIT 1)) LIMIT 1;'
    var sql11 = 'SELECT Nome AS nomeG, Abilità AS abiG, NrBattaglie AS NrG FROM GUERRIERO ORDER BY AnnoNascita LIMIT 1;';
    var sql12 = 'SELECT Nome AS d1, Abilità AS d2, NrBattaglie AS d3 FROM GUERRIERO WHERE MediaRecensione =( SELECT MediaRecensione FROM GUERRIERO ORDER BY MediaRecensione DESC LIMIT 1) LIMIT 1;';
    // definisco variabili
    var conteggio = 0;
    var conteggio1 = 0;
    var conteggio2 = 0;
    var conteggio3 = 0;
    var conteggio4 = 0;
    // altezze
    var altezza1 = 0;
    var altezza2 = 0;
    var altezza3 = 0;
    var altezza4 = 0;
    // dati specifici guerriero
    var n1 = "";
    var a1 = "";
    var numero1 = 0;

    var n2 = "";
    var a2 = "";
    var numero2 = 0;

    var n3 = "";
    var a3 = "";
    var numero3 = 0;

    db.query(sql, function(err, data1) {
        db.query(sql1, function(err, data2) {
            db.query(sql2, function(err, data3) {
                db.query(sql3, function(err, data4) {
                    db.query(sql4, function(err, data5) {
                        db.query(sql5, function(err, data6) {
                            db.query(sql6, function(err, data7) {
                                db.query(sql7, function(err, data8) {
                                    db.query(sql8, function(err, data9) {
                                        db.query(sql9, function(err, data10) {
                                            db.query(sql10, function(err, data11) {
                                                db.query(sql11, function(err, data12) {
                                                    db.query(sql12, function(err, data13) {
                                                        // salvo i dati
                                                        conteggio = data1[0].c;
                                                        conteggio1 = data2[0].c1;
                                                        conteggio2 = data3[0].c2;
                                                        conteggio3 = data5[0].c3;
                                                        conteggio4 = data6[0].c4;
                                                        altezza1 = parseInt(data7[0].a1);
                                                        altezza2 = parseInt(data8[0].a2);
                                                        altezza3 = parseInt(data9[0].a3);
                                                        altezza4 = parseInt(data10[0].a4);
                                                        // salvo le mie variabili
                                                        n1 = data11[0].N;
                                                        a1 = data11[0].A;
                                                        numero1 = data11[0].NB;
                                                        var t8 = (n1 && a1 && numero1 >= 0) ? console.log("Valori esistono") : console.log("ERRORE GRAVE IL VALORE NON ESISTE");

                                                        n2 = data12[0].nomeG;
                                                        a2 = data12[0].abiG;
                                                        numero2 = data12[0].NrG;
                                                        var t9 = (n2 && a2 && numero2 >= 0) ? console.log("Valori esistono") : console.log("ERRORE GRAVE IL VALORE NON ESISTE");

                                                        n3 = data13[0].d1;
                                                        a3 = data13[0].d2;
                                                        numero3 = data13[0].d3;
                                                        var t10 = (n3 && a3 && numero3 >= 0) ? console.log("Valori esistono") : console.log("ERRORE GRAVE IL VALORE NON ESISTE");
                                                        // mando tutto
                                                        res.render('statistiche', {
                                                            elemento : conteggio,
                                                            elemento1: conteggio1,
                                                            elemento2: conteggio2,
                                                            elemento3: data4,
                                                            elemento4: conteggio3 ,
                                                            elemento5: conteggio4,
                                                            elemento6: altezza1,
                                                            elemento7: altezza2,
                                                            elemento8: altezza3,
                                                            elemento9: altezza4,
                                                            elemento10: n1,
                                                            elemento11: a1,
                                                            elemento12: numero1,
                                                            elemento13: n2,
                                                            elemento14: a2,
                                                            elemento15: numero2,
                                                            elemento16: n3,
                                                            elemento17: a3,
                                                            elemento18: numero3,
                                                            sessionVar:ssn
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
                    });
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
