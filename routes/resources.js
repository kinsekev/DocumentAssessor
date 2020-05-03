const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
    asyncErrorHandler,
    isLoggedIn,
    checkAssessmentOwnership,
    checkResourceStarted,
    checkResourceCreateCorrectLinks,
    checkResourceUpdateCorrectLinks
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
router.get('/new', 
    isLoggedIn,
    asyncErrorHandler(checkAssessmentOwnership), 
    asyncErrorHandler(resourceNew)
);

/* POST CREATE resources /assessments/:id/resources */
router.post('/',
    isLoggedIn,
    upload.single('file'),
    asyncErrorHandler(checkAssessmentOwnership),
    asyncErrorHandler(checkResourceCreateCorrectLinks),
    asyncErrorHandler(resourceCreate)
);

/* GET EDIT resources /assessments/:id/resources/:resource_id/edit */
router.get('/:resource_id/edit', 
    isLoggedIn,
    asyncErrorHandler(checkAssessmentOwnership), 
    asyncErrorHandler(checkResourceStarted),
    asyncErrorHandler(resourceEdit)
);

/* PUT UPDATE resources /assessments/:id/resources/:resource_id */
router.put('/:resource_id', 
    isLoggedIn,
    upload.single('file'), 
    asyncErrorHandler(checkAssessmentOwnership), 
    asyncErrorHandler(checkResourceStarted), 
    asyncErrorHandler(checkResourceUpdateCorrectLinks),
    asyncErrorHandler(resourceUpdate)
);

/* DELETE DESTROY resources /assessments/:id/resources/:resource_id */
router.delete('/:resource_id',
    isLoggedIn,
    asyncErrorHandler(checkAssessmentOwnership), 
    asyncErrorHandler(checkResourceStarted), 
    asyncErrorHandler(resourceDestroy)
);

module.exports = router;
