const fs = require('fs');
const readline = require('readline');
const Assessment = require('../models/assessment');
const Resource = require('../models/resource');
const Form = require('../models/form');
const User = require('../models/user');

module.exports = {

    // new resource
    async resourceNew(req, res, next) {
        // find the assessment by id
        let assessment = await Assessment.findById(req.params.id);
        // find the users by id
        let users = await User.find({});
        // render the resources/new page passing in the assessment and users
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
        // check if a user was passed
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
        // add flash message
        req.flash('success', 'Successfully added new resource');
        // redirect to the assessment
        res.redirect(`/assessments/${assessment.id}`);
    },
    
    // edit resource route
    async resourceEdit(req, res, next) {
        // find the assessment by id
        let assessment = await Assessment.findById(req.params.id);
        // find the resource by id
        let resource = await Resource.findById(req.params.resource_id);
        // find the users by id
        let users = await User.find({});
        // render the resources/edit page, passing the assessment, resources and users
        res.render('resources/edit', { assessment, resource, users });
    },

    // update resource route
    async resourceUpdate(req, res, next) {
        console.log(req.body.task);
        // define variables
        let user = req.body.user;
        let userObj;
        let currentUser;
        if(user) {
            // find the user in the database
            currentUser = await User.findOne( { username: user } );
            // define user object
            userObj = {
                id: currentUser.id,
                username: currentUser.username
            }
        } else {
            // if assign no user is passed
            userObj = undefined;
        }
        // find the assessment by id
        let assessment = await Assessment.findById(req.params.id);
        // define updated object
        let updatedObj = {
            task: assessment.instructions,
            user: userObj
        }
        // update resource from req.body.resource object passed through form
        let updatedResource = await Resource.findByIdAndUpdate(req.params.resource_id, updatedObj);
        // if the user wants to edit the links
        if(req.body.deleteLinks && req.body.deleteLinks.length) {
            // read text file with resources on each line
            const fileStream = await fs.createReadStream(req.file.path);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });
            // create an array of resources
            let linksArr = [];
            for await (let line of rl) {
                linksArr.push(line);
            }
            // remove the links the need to be deleted
           let deleteLinks = req.body.deleteLinks;
           let resourceLinks = updatedResource.links;
           for (let i = 0; i < deleteLinks.length; i++) {
               let curDLink = deleteLinks[i];
               let curIndex = resourceLinks.indexOf(curDLink);
               resourceLinks.splice(curIndex, 1);
           }
           // add in the new links
           for await(let link of linksArr) {
               resourceLinks.push(link);
           }
           // add the new links to the resource
           updatedResource.links = resourceLinks;
           // save the resource
           updatedResource.save();
        }
        // add flash message
        req.flash('success', 'Successfully updated the resource');
        // redirect to the assessment page where the resource has been updated
        res.redirect(`/assessments/${req.params.id}`);
    },

    // delete resource
    async resourceDestroy(req, res, next) {
        // find the resource by id
        let resource = await Resource.findById(req.params.resource_id);
        // delete the resource
        await resource.remove();
        // add flash message
        req.flash('success', 'Successfully deleted the resource');
        // redirect to the assessment page where the resource has been deleted
        res.redirect(`/assessments/${req.params.id}`);
    }
}