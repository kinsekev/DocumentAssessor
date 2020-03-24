const User = require('../models/user');
const passport = require('passport');

module.exports = {
    // GET /register
    async getRegister(req, res, next) {
        res.render('users/register');
    },

    // POST /register
    async postRegister(req, res, next) {
        let isResearcher;
        if (req.body.userType === "researcher") {
            isResearcher = true;
        } else {
            isResearcher = false;
        }
        const newUser = new User({
            username: req.body.username,
            isResearcher: isResearcher
        });
        await User.register(newUser, req.body.password);
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/users/login'
        })(req, res, next);
    },

    // GET /login
    async getLogin(req, res, next) {
        res.render('users/login');
    },

    // POST /login
    async postLogin(req, res, next) {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/users/login'
        })(req, res, next);
    },

    // GET /logout
    async getLogout(req, res, next) {
        req.logout();
        res.redirect('/assessments');
    }
}