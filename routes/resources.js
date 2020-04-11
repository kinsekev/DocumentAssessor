const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
    asyncErrorHandler 
} = require('../middleware');
const {
    resourceUserUpdate,
    resourceUserRemove
} = require('../controllers/resources');


/* PUT UPDATE assessments index /assessments/:id/resources/:resources_id */
router.put('/:resource_id', asyncErrorHandler(resourceUserUpdate));

/* PUT UPDATE assessments index /assessments/:id/resources/:resources_id/user/:user_id */
router.put('/:resource_id/user/:user_id', asyncErrorHandler(resourceUserRemove));

module.exports = router;
