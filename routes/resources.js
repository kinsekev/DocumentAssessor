const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
    asyncErrorHandler,
    isLoggedIn
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
router.get('/new', isLoggedIn, asyncErrorHandler(resourceNew));

/* POST CREATE resources /assessments/:id/resources */
router.post('/', upload.single('file'), asyncErrorHandler(resourceCreate));

/* GET EDIT resources /assessments/:id/resources/:resource_id/edit */
router.get('/:resource_id/edit', asyncErrorHandler(resourceEdit));

/* PUT UPDATE resources /assessments/:id/resources/:resource_id */
router.put('/:resource_id', upload.single('file'), asyncErrorHandler(resourceUpdate));

/* DELETE DESTROY resources /assessments/:id/resources/:resource_id */
router.delete('/:resource_id', asyncErrorHandler(resourceDestroy));

module.exports = router;
