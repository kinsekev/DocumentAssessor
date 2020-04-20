const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
    asyncErrorHandler,
    checkAssessmentOwnership,
    checkResourceStarted
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
router.post('/', upload.single('file'), checkAssessmentOwnership,  asyncErrorHandler(resourceCreate));

/* GET EDIT resources /assessments/:id/resources/:resource_id/edit */
router.get('/:resource_id/edit', checkAssessmentOwnership, checkResourceStarted, asyncErrorHandler(resourceEdit));

/* PUT UPDATE resources /assessments/:id/resources/:resource_id */
router.put('/:resource_id', upload.single('file'), checkAssessmentOwnership, checkResourceStarted, asyncErrorHandler(resourceUpdate));

/* DELETE DESTROY resources /assessments/:id/resources/:resource_id */
router.delete('/:resource_id', checkAssessmentOwnership, checkResourceStarted, asyncErrorHandler(resourceDestroy));

module.exports = router;
