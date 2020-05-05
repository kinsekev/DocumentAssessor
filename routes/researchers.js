const express = require('express');
const passport = require('passport');
const router = express.Router();
const { 
  asyncErrorHandler,
  checkIfResearcherExists
} = require('../middleware');
const {
  getRegister,
  postRegister,
  getLogin,
  getLogout
} = require('../controllers/researchers');

/* GET /register */
router.get('/register', getRegister);

/* POST /register */
router.post('/register', 
    asyncErrorHandler(checkIfResearcherExists), 
    postRegister
);

/* GET /login */
router.get('/login', getLogin);

/* POST /login */
router.post('/login', passport.authenticate('local',
    { 
      successRedirect: '/assessments', 
      failureRedirect: '/researchers/login',
      successFlash: 'Welcome to the Document Assessor Application',
      failureFlash: 'Invalid username or password'
}));

/* GET /logout */
router.get('/logout', getLogout);

module.exports = router;
