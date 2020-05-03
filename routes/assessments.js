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
    checkAssessmentStarted,
    checkAssessmentCorrectLinks,
    checkAssessmentCorrectUsers,
    checkAssessmentUpdateCorrectLinks,
    checkAssessmentUpdateCorrectUsers
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
router.get('/new', 
    isLoggedIn,
    asyncErrorHandler(assessmentNew)
);

/* POST CREATE assessments /assessments */
router.post('/', 
    isLoggedIn, 
    upload.single('file'),
    asyncErrorHandler(checkAssessmentCorrectLinks),
    asyncErrorHandler(checkAssessmentCorrectUsers),
    asyncErrorHandler(assessmentCreate)
);

/* GET SHOW assessments /assessments/:id */
router.get('/:id', asyncErrorHandler(assessmentShow));

/* GET EDIT assessments /assessments/:id/edit */
router.get('/:id/edit',
    isLoggedIn,
    asyncErrorHandler(checkAssessmentOwnership), 
    asyncErrorHandler(checkAssessmentStarted), 
    asyncErrorHandler(assessmentEdit)
);

/* PUT UPDATE assessments /assessments/:id */
router.put('/:id', 
    isLoggedIn,
    upload.single('file'),
    asyncErrorHandler(checkAssessmentOwnership),
    asyncErrorHandler(checkAssessmentStarted),
    asyncErrorHandler(checkAssessmentUpdateCorrectLinks),
    asyncErrorHandler(checkAssessmentUpdateCorrectUsers),
    asyncErrorHandler(assessmentUpdate)
);

/* DELETE DESTROY assessments  /assessments/:id */
router.delete('/:id',
    isLoggedIn,
    asyncErrorHandler(checkAssessmentOwnership), 
    asyncErrorHandler(checkAssessmentStarted),
    asyncErrorHandler(assessmentDestroy)
);

module.exports = router;