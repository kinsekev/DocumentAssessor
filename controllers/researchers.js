const Assessment = require('../models/assessment');
const Researcher = require('../models/researcher');
const passport = require('passport');

module.exports = {
    // GET /register
    getRegister(req, res, next) {
        res.render('researchers/register');
    },
    // POST /register
    postRegister(req, res, next) {
        const newResearcher = new Researcher({
            username: req.body.username
        });
        Researcher.register(newResearcher, req.body.password, function(err, researcher) {
            if(err) {
                return res.render('researchers/register', {'error': err.message});
            } else {
                passport.authenticate('local')(req, next, function() {
                    req.flash('success', 'Welcome to Document Assessor, ' + req.body.username);
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
        req.logout();
        req.flash('success', 'Logged you out!');
        res.redirect('/assessments');
    }
}