const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
    asyncErrorHandler 
} = require('../middleware');
const {
    formCreate,
    formEdit,
    formUpdate,
    formDestroy
} = require('../controllers/forms');


/* POST CREATE assessments index /assessments/:id/resources/:resource_id/forms */
router.post('/', asyncErrorHandler(formCreate));

/* GET EDIT assessments index /assessments/:id/resources/:resource_id/forms/:form_id */
router.get('/:form_id/edit', asyncErrorHandler(formEdit));

/* PUT CREATE assessments index /assessments */
router.put('/:form_id', asyncErrorHandler(formUpdate));

/* DELETE assessments index /assessments/:id/resources/:resource_id/forms/:form_id */
router.delete('/:form_id', asyncErrorHandler(formDestroy));

module.exports = router;