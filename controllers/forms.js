const Assessment = require('../models/assessment');
const Resource = require('../models/resource');
const Form = require('../models/form');
const User = require('../models/user');

module.exports = {

    // create form
    async formCreate(req, res, next) {
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
        let assessment = await Assessment.findById(req.params.id);
        let resource = await Resource.findById(req.params.resource_id);
        let form = await Form.findById(req.params.form_id);
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
        // redirect to the assessment page
        res.redirect(`/assessments/${req.params.id}`);
    },

    // destroy form
    async destroyForm(req, res, next) {
        res.send('You hit the delete route!');
        // // find the resource by id
        // let form = await Resource.findById(req.params.form_id);
        // // get the link associated with the form
        // let formLink = form.link;
        // // delete the resource
        // await form.remove();
        // // find the resource by id
        // let resource = await Resource.findById(req.params.resource_id);
        // // create form object
        // let formObj = { 
        //     link : curLink,
        // }
        // // create form
        // let newForm = await Form.create(formObj);
        // // push form to the resource
        // resource.forms.push(newForm);
        // // save the resource
        // resource.save();
        // // redirect to the assessment page where the resource has been deleted
        // res.redirect(`/assessments/${req.params.id}`);
    }
}