const express = require('express');
const router = express.Router( { mergeParams: true } );
const { 
    asyncErrorHandler,
    isLoggedIn,
    checkAssessmentOwnership
} = require('../middleware');
const {
    assignUser
} = require('../controllers/assign');

/* POST CREATE assessments /assessments */
router.post('/', 
    isLoggedIn,
    asyncErrorHandler(checkAssessmentOwnership),
    asyncErrorHandler(assignUser)
);

module.exports = router;