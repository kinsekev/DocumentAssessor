const express = require('express');
const router = express.Router();
const { 
  asyncErrorHandler,
  checkIfResearcherExists
} = require('../middleware');
const {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
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
router.post('/login', postLogin);

/* GET /logout */
router.get('/logout', getLogout);

module.exports = router;
