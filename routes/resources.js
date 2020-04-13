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


/* GET NEW resource index /assessments/:id/resources/new */
router.get('/new', asyncErrorHandler(resourceNew));

/* POST CREATE resource index /assessments/:id/resources */
router.post('/', upload.single('file'), asyncErrorHandler(resourceCreate));

/* GET EDIT assessments index /assessments/:id/resources/:resource_id/edit */
router.get('/:resource_id/edit', asyncErrorHandler(resourceEdit));

/* PUT UPDATE assessments index /assessments/:id/resources/:resource_id */
router.put('/:resource_id', asyncErrorHandler(resourceUpdate));

/* DELETE assessments index /assessments/:id/resources/:resource_id/delete */
router.delete('/:resource_id', asyncErrorHandler(resourceDestroy));

module.exports = router;
