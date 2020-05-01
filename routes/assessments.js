const express = require('express');
const router = express.Router( { mergeParams: true } );
const multer = require('multer');
const upload = multer(
    {
        'dest': 'uploads/'
    });
const { 
    asyncErrorHandler,
    isLoggedIn,
    checkAssessmentOwnership,
    checkAssessmentStarted
} = require('../middleware');
const {
    assessmentIndex,
    assessmentNew,
    assessmentCreate,
    assessmentShow,
    assessmentEdit,
    assessmentUpdate,
    assessmentDestroy
} = require('../controllers/assessments');

/* GET INDEX assessments /assessments */
router.get('/', asyncErrorHandler(assessmentIndex));

/* GET NEW assessments /assessments/new */
router.get('/new', isLoggedIn, asyncErrorHandler(assessmentNew));

/* POST CREATE assessments /assessments */
router.post('/', upload.single('file'), isLoggedIn, asyncErrorHandler(assessmentCreate));

/* GET SHOW assessments /assessments/:id */
router.get('/:id', asyncErrorHandler(assessmentShow));

/* GET EDIT assessments /assessments/:id/edit */
router.get('/:id/edit', checkAssessmentOwnership, checkAssessmentStarted, asyncErrorHandler(assessmentEdit));

/* PUT UPDATE assessments /assessments/:id */
router.put('/:id', upload.single('file'), checkAssessmentOwnership, checkAssessmentStarted, asyncErrorHandler(assessmentUpdate));

/* DELETE DESTROY assessments  /assessments/:id */
router.delete('/:id', checkAssessmentOwnership, checkAssessmentStarted, asyncErrorHandler(assessmentDestroy));

module.exports = router;