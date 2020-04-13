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
        let resourceObj = {
            task: task,
            links: resourceArr.slice(0, resourceArr.length),
            started: false
        }

        // create the resource
        let resource = await Resource.create(resourceObj);
        // push resource onto the assessment
        assessment.resources.push(resource);
        // save the assessment
        assessment.save();

        if(user) {
            // assign user if there is one passed
            let currentUser = await User.findOne({ username: user });
            userObj = {
                id: currentUser.id,
                username: currentUser.username
            }
            resource.user = userObj;
            resource.save();
        }
        // redirect to the assessment
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
        // delete the resource
        await resource.remove();
        // redirect to the assessment page where the resource has been deleted
        res.redirect(`/assessments/${req.params.id}`);
    }
}