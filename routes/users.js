const express = require('express');
const router = express.Router();
const { 
  asyncErrorHandler 
} = require('../middleware');
const {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout
} = require('../controllers/users');

/* GET /register */
router.get('/register', asyncErrorHandler(getRegister));

/* POST /register */
router.post('/register', asyncErrorHandler(postRegister));

/* GET /login */
router.get('/login', asyncErrorHandler(getLogin));

/* POST /login */
router.post('/login', asyncErrorHandler(postLogin));

/* GET /logout */
router.get('/logout', asyncErrorHandler(getLogout));

module.exports = router;
