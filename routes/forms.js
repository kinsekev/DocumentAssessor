const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
    asyncErrorHandler 
} = require('../middleware');
const {
    formUpdate
} = require('../controllers/forms');


/* PUT CREATE assessments index /assessments */
router.put('/:form_id', asyncErrorHandler(formUpdate));

module.exports = router;