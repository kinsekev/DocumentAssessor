const User = require('../models/user');
const passport = require('passport');

module.exports = {
    // GET /register
    async getRegister(req, res, next) {
        res.render('users/register');
    },

    // POST /register
    async postRegister(req, res, next) {
        const newUser = new User({
            username: req.body.username
        });
        await User.register(newUser, req.body.password);
        res.redirect('/');
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