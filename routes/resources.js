const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
    asyncErrorHandler,
    checkAssessmentOwnership
} = require('../middleware');
const multer = require('multer');
const upload = multer(
    {
        'dest': 'uploads/'
    });
const {
    resourceNew,
    resourceCreate,
    resourceEdit,
    resourceUpdate,
    resourceDestroy
} = require('../controllers/resources');


/* GET NEW resources /assessments/:id/resources/new */
router.get('/new', checkAssessmentOwnership, asyncErrorHandler(resourceNew));

/* POST CREATE resources /assessments/:id/resources */
router.post('/', checkAssessmentOwnership, upload.single('file'), asyncErrorHandler(resourceCreate));

/* GET EDIT resources /assessments/:id/resources/:resource_id/edit */
router.get('/:resource_id/edit', checkAssessmentOwnership, asyncErrorHandler(resourceEdit));

/* PUT UPDATE resources /assessments/:id/resources/:resource_id */
router.put('/:resource_id', checkAssessmentOwnership, upload.single('file'), asyncErrorHandler(resourceUpdate));

/* DELETE DESTROY resources /assessments/:id/resources/:resource_id */
router.delete('/:resource_id', checkAssessmentOwnership, asyncErrorHandler(resourceDestroy));

module.exports = router;
