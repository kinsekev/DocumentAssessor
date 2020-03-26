const Researcher = require('../models/researcher');
const passport = require('passport');

module.exports = {
    // GET /register
    async getRegister(req, res, next) {
        res.render('researchers/register');
    },

    // POST /register
    async postRegister(req, res, next) {
        const newResearcher = new Researcher({
            username: req.body.username
        });
        await Researcher.register(newResearcher, req.body.password);
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/researchers/login'
        })(req, res, next);
    },

    // GET /login
    async getLogin(req, res, next) {
        res.render('researchers/login');
    },

    // POST /login
    async postLogin(req, res, next) {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/researchers/login'
        })(req, res, next);
    },

    // GET /logout
    async getLogout(req, res, next) {
        req.logout();
        res.redirect('/assessments');
    }
}