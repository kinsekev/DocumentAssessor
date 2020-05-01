const Assessment = require('../models/assessment');
const Resource = require('../models/resource');
const Form = require('../models/form');
const User = require('../models/user');

module.exports = {

    // create form
    async formCreate(req, res, next) {
        // find the assessment by id
        let assessment = await Assessment.findById(req.params.id);
        // start the assessment
        assessment.started = true;
        // save the assessment
        assessment.save();
        // find the resource by id
        let resource = await Resource.findById(req.params.resource_id);
        // set resource started to true
        resource.started = true;
        // for each of the links create a form so the user can input
        for await (let curLink of resource.links) {
            let formObj = { 
                link : curLink,
            }
            // create form
            let newForm = await Form.create(formObj);
            // push form to the resource
            resource.forms.push(newForm);
            // save the resource
            resource.save();
        }
        // redirect to the assessment page
        res.redirect(`/assessments/${req.params.id}`);
    },

    // edit route
    async formEdit(req, res, next) {
        // find the assessment by id
        let assessment = await Assessment.findById(req.params.id);
        // find the resource by id
        let resource = await Resource.findById(req.params.resource_id);
        // find the form by id
        let form = await Form.findById(req.params.form_id);
        // render the forms/edit page passing assessment, resource and form
        res.render('forms/edit', { assessment, resource, form });
    },

    // update form
    async formUpdate(req, res, next) {
        // define the rating and text in an object
        let formObj = {
            text: req.body.ratingText,
            rating: req.body.rating
        }
        // update the resource with the assessment from the user
        await Form.findByIdAndUpdate(req.params.form_id, formObj);
        // add flash message
        req.flash('success', 'Successfully submitted the form');
        // redirect to the assessment page
        res.redirect(`/assessments/${req.params.id}`);
    },

    // destroy form
    async formDestroy(req, res, next) {
        // find the resource by id
        let resource = await Resource.findById(req.params.resource_id);
        // remove the form from the resource.form array
        resource.forms.pull(req.params.form_id);
        // find the form by id
        let form = await Form.findById(req.params.form_id);
        // get the link by id
        let formLink = form.link;
        // delete the form by id
        await Form.findByIdAndDelete(req.params.form_id);
        // create new object form
        let formObj = { 
            link : formLink,
        }
        // create new form
        let newForm = await Form.create(formObj);
        // push new form to the resource
        resource.forms.push(newForm);
        // save the resource
        resource.save();
        // add flash message
        req.flash('success', 'Successfully restarted the form');
        // redirect to the assessment page
        res.redirect(`/assessments/${req.params.id}`);
    }
}