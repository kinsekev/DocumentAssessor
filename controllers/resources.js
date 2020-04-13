const fs = require('fs');
const readline = require('readline');
const Assessment = require('../models/assessment');
const Resource = require('../models/resource');
const Form = require('../models/form');
const User = require('../models/user');

module.exports = {

    // new resource
    async resourceNew(req, res, next) {
        let assessment = await Assessment.findById(req.params.id);
        let users = await User.find({});
        res.render('resources/new', { assessment, users });
    },

    // create resource
    async resourceCreate(req, res, next) {

        // find the assessment
        let assessment = await Assessment.findById(req.params.id);

        // read text file with resources on each line
        const fileStream = await fs.createReadStream(req.file.path);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        // create an array of resources
        let resourceArr = [];
        for await (let line of rl) {
            resourceArr.push(line);
        }

        // variables
        let task = assessment.instructions;
        let user = req.body.user;
        let newResource;
        let userObj;

        if(user) {
            // assign user if there is one passed
            let currentUser = await User.findOne({ username: user });
            userObj = {
                id: currentUser.id,
                username: currentUser.username
            }
            newResource = await Resource.create({ task: task, user: userObj });
        } else {
            // don't assign user if there is not one passed
            newResource = await Resource.create({ task: task });
        }
        
        // create a form for each of the links the user must assess
        for (let index = 0; index < resourceArr.length; index++) {
            let curLink = { link : resourceArr[index] };
            let newForm = await Form.create(curLink);
            newResource.links.push(newForm);
            newResource.save();
        }
        assessment.resources.push(newResource);
        assessment.save();

        res.redirect(`/assessments/${assessment.id}`);
    },
    
    // edit resource route
    async resourceEdit(req, res, next) {
        let assessment = await Assessment.findById(req.params.id);
        let resource = await Resource.findById(req.params.resource_id);
        let users = await User.find({});
        res.render('resources/edit', { assessment, resource, users });
    },

    // update resource route
    async resourceUpdate(req, res, next) {
        // update resource from req.body.resource object passed through form
        let updatedResource = await Resource.findByIdAndUpdate(req.params.resource_id, req.body.resource);
        // define variables
        let user = req.body.user;
        let userObj;
        let currentUser;
        // if user is passed
        if(user) {
            // change of user on a resource
            currentUser = await User.findOne( { username: user } );
            userObj = {
                id: currentUser.id,
                username: currentUser.username
            }
            updatedResource.user = userObj;
            updatedResource.save();
        } else {
            // unassign a user on a resource
            await Resource.findByIdAndUpdate(req.params.resource_id, { user: undefined });
        }
        // redirect to the assessment page where the resource has been updated
        res.redirect(`/assessments/${req.params.id}`);
    },

    // delete resource
    async resourceDestroy(req, res, next) {
        // find the resource by id
        let resource = await Resource.findById(req.params.resource_id);
        // find the forms associated with this resource and delete them
        let links = resource.links;
        for await(let link of links) {
            await Form.findByIdAndRemove(link);
        }
        // delete the resource
        await resource.remove();
        // redirect to the assessment page where the resource has been deleted
        res.redirect(`/assessments/${req.params.id}`);
    }
}