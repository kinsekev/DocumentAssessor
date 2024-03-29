const fs = require('fs');
const readline = require('readline');
const mongoose = require('mongoose');
const Assessment = require('../models/assessment');
const Resource = require('../models/resource');
const Form = require('../models/form');
const User = require('../models/user');

module.exports = {
    // index assessments
    async assessmentIndex(req, res, next) {
        // find all the assessments
        let assessments = await Assessment.find({});
        // render the assessments/index page passing all the assessments
        res.render('assessments/index', { assessments });
    },

    // new assessments
    async assessmentNew(req, res, next) {
        // find all the users in the database
        let users = await User.find({});
        // render the assessments/new page passing in all the users
        res.render('assessments/new', { users });
    },
    
    // create assessment
    async assessmentCreate(req, res, next) {
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
        // adding user
        req.body.assessment.researcher = {
            id: req.user._id,
            username: req.user.username
        }
        // create the assessment
        let assessment = await Assessment.create(req.body.assessment);
        // set the assessment started to false
        assessment.started = false;
        assessment.totalNumLinks = resourceArr.length;
        assessment.totalLinksCompleted = 0;
        
        // create variables for assignment
        let task = assessment.instructions;
        let lastIndex = assessment.numLinksPerUser;
        // create a resource based on the number of assessment per user
        for (let i = 0; i < resourceArr.length; i += lastIndex) {
            // create resource object
            let resourceObj = {
                task: task,
                links: resourceArr.slice(i, i + lastIndex),
                started: false
            }
            // create the resource
            let resource = await Resource.create(resourceObj);
            // push the resource to the assessment
            assessment.resources.push(resource);
            // save the assessment
            assessment.save();
        }

        // define users from input
        let users = req.body.users;
        
        if(users) {
            // find all the resource ids and store in array
            let resourceIDs = [];
            assessment.resources.forEach(function(resource) {
                resourceIDs.push(resource._id);
            });

            // handle multiple users passed through drop down list
            if(Array.isArray(users)) {
                let index = 0;
                // for each of the users in the array assign them to a resource
                for await (let curUser of users) {
                    // choose a resource
                    let curResourceID = resourceIDs[index];
                    // find the resource by id
                    let resource = await Resource.findById(curResourceID);
                    // find the user in the database
                    let currentUser = await User.findOne( { username: curUser } );
                    // store the user in the resource
                    resource.user.id = currentUser.id;
                    resource.user.username = currentUser.username;
                    // save the resource
                    resource.save();
                    index += 1;
                }
            } else {
                // define single user
                let user = users;
                // find the user in the database
                let currentUser = await User.findOne( { username: user });
                // get the first resource
                let curResourceID = resourceIDs[0];
                // find the resource by id
                let resource = await Resource.findById(curResourceID);
                // define a user object
                let userObj = {
                    id: currentUser.id,
                    username: currentUser.username
                }
                // store the user in the resource
                resource.user = userObj;
                // save the resource
                resource.save();
            }
        }
        // success flash message
        req.flash('success', 'Successfully added assessment')
        // redirect to the assessments page of that id
        res.redirect(`/assessments/${assessment.id}`);
    },

    // show assessment
    async assessmentShow(req, res, next) {
        // find the assessment by id and populate the nested forms
        let assessment = await Assessment.findById(req.params.id).populate({
            path: 'resources forms',
            populate: {
                path: 'forms'
            }   
        }).exec();
        // define array for assigned users
        let assessmentUsers = [];
        // find the users object id for each assigned resource
        for await(let resoruce of assessment.resources) {
            if(resoruce.user.username) {
                assessmentUsers.push(mongoose.Types.ObjectId(resoruce.user.id));
            }
        }
        // filter to the unassigned users
		let users = await User.find(
            {
                _id: {
                    $nin: assessmentUsers
                }
            });
        let perComp = assessment.calPercentComp();
        // render the assessments/show page passing in the assessment
        res.render('assessments/show', { assessment, users, perComp });
    },

    // edit route
    async assessmentEdit(req, res, next) {
        // find the assessment by id
        let assessment = await Assessment.findById(req.params.id);
        // find all the users in the database
        let users = await User.find({});
        // render the assessments/edit page passing the assessments and the users
        res.render('assessments/edit', { assessment, users });
    },

    async assessmentUpdate(req, res, next) {
        // find the assessment by id
        let assessment = await Assessment.findById(req.params.id);
        // find the resources associated with the assessment
        let resources = assessment.resources;
        // for each resource
        for await(let resource of resources) {
            // find the resoruce by id
            let curResource = await Resource.findById(resource);
            // find the forms associated with the current resource
            let forms = curResource.forms;
            // if there are forms
            if (forms) {
                // for each of the forms
                for await(let form of forms) {
                    // delete each form by id
                    await Form.findByIdAndDelete(form);
                }
            }
            // deltere the current resource
            await curResource.remove();
        }
        // delete the assessment
        await assessment.remove();
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
        // adding user
        req.body.newAssess.researcher = {
            id: req.user._id,
            username: req.user.username
        }
        // create the assessment
        let newAssessment = await Assessment.create(req.body.newAssess);
        // set the assessment started to false
        newAssessment.started = false;
        newAssessment.totalNumLinks = resourceArr.length;
        newAssessment.totalLinksCompleted = 0;
        // save assessment
        newAssessment.save();
        
        // create variables for assignment
        let task = newAssessment.instructions;
        let lastIndex = newAssessment.numLinksPerUser;
        // create a resource based on the number of assessment per user
        for (let i = 0; i < resourceArr.length; i += lastIndex) {
            // create resource object
            let resourceObj = {
                task: task,
                links: resourceArr.slice(i, i + lastIndex),
                started: false
            }
            // create the resource
            let newResource = await Resource.create(resourceObj);
            // push the resource to the assessment
            newAssessment.resources.push(newResource);
            // save the assessment
            newAssessment.save();
        }

        // assign users if researcher has added users in drop
        let users = req.body.users;
        
        if(users) {
            // find all the resource ids and store in array
            let resourceIDs = [];
            newAssessment.resources.forEach(function(resource) {
                resourceIDs.push(resource._id);
            });

            // handle multiple users passed through drop down list
            if(Array.isArray(users)) {
                let index = 0;
                // for each of the users in the array assign them to a resource
                for await (let curUser of users) {
                    // choose a resource
                    let curResourceID = resourceIDs[index];
                    // find the resource by id
                    let resource = await Resource.findById(curResourceID);
                    // find the user in the database
                    let currentUser = await User.findOne( { username: curUser } );
                    // store the user in the resource
                    resource.user.id = currentUser.id;
                    resource.user.username = currentUser.username;
                    // save the resource
                    resource.save();
                    index += 1;
                }
            } else {
                // define single user
                let user = users;
                // find the user in the database
                let currentUser = await User.findOne( { username: user });
                // get the first resource
                let curResourceID = resourceIDs[0];
                // find the resource by id
                let resource = await Resource.findById(curResourceID);
                // define a user object
                let userObj = {
                    id: currentUser.id,
                    username: currentUser.username
                }
                // store the user in the resource
                resource.user = userObj;
                // save the resource
                resource.save();
            }
        }
        // add flash message
        req.flash('success', 'Successfully updated the assessment');
        // redirect to the assessments page of that id
        res.redirect(`/assessments/${newAssessment.id}`);
    },

    // delete route
    async assessmentDestroy(req, res, next) {
        // find the assessment by id
        let assessment = await Assessment.findById(req.params.id);
        // find the resources associated with the assessment
        let resources = assessment.resources;
        // for each resource
        for await(let resource of resources) {
            // find the resoruce by id
            let curResource = await Resource.findById(resource);
            // find the forms associated with the current resource
            let forms = curResource.forms;
            // if there are forms
            if (forms) {
                // for each of the forms
                for await(let form of forms) {
                    // delete each form by id
                    await Form.findByIdAndDelete(form);
                }
            }
            // deltere the current resource
            await curResource.remove();
        }
        // delete the assessment
        await assessment.remove();
        // flash message
        req.flash('success', 'Successfully delete the assessment');
        // redirect to the main assessments page
        res.redirect('/assessments');
    }
}