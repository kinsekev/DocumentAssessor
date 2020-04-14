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


/* POST CREATE forms /assessments/:id/resources/:resource_id/forms */
router.post('/', asyncErrorHandler(formCreate));

/* GET EDIT forms /assessments/:id/resources/:resource_id/forms/:form_id/edit */
router.get('/:form_id/edit', asyncErrorHandler(formEdit));

/* PUT UPDATE forms /assessments/:id/resources/:resource_id/forms/:form_id */
router.put('/:form_id', asyncErrorHandler(formUpdate));

/* DELETE DESTROY form /assessments/:id/resources/:resource_id/forms/:form_id */
router.delete('/:form_id', asyncErrorHandler(formDestroy));

module.exports = router;