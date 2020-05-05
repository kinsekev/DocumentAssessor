const Researcher = require('../models/researcher');
const passport = require('passport');

module.exports = {
    // GET /register
    getRegister(req, res, next) {
        res.render('researchers/register');
    },
    // POST /register
    postRegister(req, res, next) {
        // create a new researcher
        const newResearcher = new Researcher({
            username: req.body.username
        });
        // register the researcher
        Researcher.register(newResearcher, req.body.password, function(err, researcher) {
            if(err) {
                // render the researchers/register
                return res.render('researchers/register', {'error': err.message});
            } else {
                // authenticate the researcher
                passport.authenticate('local')(req, next, function() {
                    req.flash('success', 'Welcome to Document Assessor, ' + req.body.username);
                    // redirect to the /assessments page
                    res.redirect('/assessments');
                });
            }
        });
    },
    // GET /login
    getLogin(req, res, next) {
        res.render('researchers/login');
    },
    
    // GET /logout
    getLogout(req, res, next) {
        // logout
        req.logout();
        req.flash('success', 'Logged you out!');
        res.redirect('/assessments');
    }
}