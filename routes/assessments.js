const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(
    {
        'dest': 'uploads/'
    });
const { 
    asyncErrorHandler 
} = require('../middleware');
const {
    assessmentIndex,
    assessmentNew,
    assessmentCreate,
    assessmentShow,
    assessmentDestroy
} = require('../controllers/assessments');

/* GET INDEX assessments index /assessments */
router.get('/', asyncErrorHandler(assessmentIndex));

/* GET NEW assessments index /assessments/new */
    router.get('/new', asyncErrorHandler(assessmentNew));


/* POST CREATE assessments index /assessments */
router.post('/', upload.single('file'), asyncErrorHandler(assessmentCreate));

/* GET SHOW assessments index /assessments/:id */
router.get('/:id', asyncErrorHandler(assessmentShow));

/* GET EDIT assessments index /assessments/:id/edit */
router.get('/:id/edit', (req, res, next) => {
    res.send('GET EDIT /assessments/:id/edit route');
});

/* PUT UPDATE assessments index /assessments/:id */
router.put('/:id', (req, res, next) => {
    res.send('PUT UPDATE /assessments/:id route');
});

/* DELETE assessments index /assessments/:id */
router.delete('/:id', asyncErrorHandler(assessmentDestroy));

module.exports = router;