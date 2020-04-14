const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
    asyncErrorHandler 
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
router.get('/new', asyncErrorHandler(resourceNew));

/* POST CREATE resources /assessments/:id/resources */
router.post('/', upload.single('file'), asyncErrorHandler(resourceCreate));

/* GET EDIT resources /assessments/:id/resources/:resource_id/edit */
router.get('/:resource_id/edit', asyncErrorHandler(resourceEdit));

/* PUT UPDATE resources /assessments/:id/resources/:resource_id */
router.put('/:resource_id', asyncErrorHandler(resourceUpdate));

/* DELETE DESTROY resources /assessments/:id/resources/:resource_id */
router.delete('/:resource_id', asyncErrorHandler(resourceDestroy));

module.exports = router;
