var express = require('express');
var router = express.Router();
var db=require('../database');
var bodyParser = require('body-parser');

var ssn ;

router.use(bodyParser.urlencoded({ extended: true }));

//lancio della pagina contatti
router.get('/', function(req, res) {
    ssn = req.session;
    res.render('contatti', { sessionVar:ssn});
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
    response.redirect("/");
    response.end();
});

module.exports = router;
