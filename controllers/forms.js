const Assessment = require('../models/assessment');
const Resource = require('../models/resource');
const Form = require('../models/form');
const User = require('../models/user');

module.exports = {

    async formUpdate(req, res, next) {

        console.log(req.body);
        console.log(req.params);

        let formObj = {
            text: req.body.ratingText,
            rating: req.body.rating
        }

        let form = await Form.findByIdAndUpdate(req.params.form_id, formObj);

        console.log(form);

        res.redirect(`/assessments/${req.params.id}`);
    } 
}