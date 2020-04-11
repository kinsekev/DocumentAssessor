const fs = require('fs');
const readline = require('readline');
const Assessment = require('../models/assessment');
const Resource = require('../models/resource');
const Form = require('../models/form');
const User = require('../models/user');
const mongoose = require('mongoose');

module.exports = {
    // index assessments
    async assessmentIndex(req, res, next) {
        let assessments = await Assessment.find({});
        res.render('assessments/index', { assessments });
    },

    // new assessments
    async assessmentNew(req, res, next) {
        let users = await User.find({});
        res.render('assessments/new', { users });
    },
    //assesmet tes
    async  assessmentTest(req, res, next){
        res.render('assessments/test');
    },

    // create assessment
    async assessmentCreate(req, res, next) {
        // create the assessment
        let assessment = await Assessment.create(req.body.assessment);

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

        // create variables for assignment
        let curIndex = 0;
        let task = assessment.instructions;
        let lastIndex = assessment.numAssessmentsPerUser;
    
        for (let i = curIndex; i < resourceArr.length; i++) {
            let resource = await Resource.create({ task: task });
            for (let j = curIndex; j < lastIndex; j++) {
                let curLink = { link : resourceArr[j] };
                let newForm = await Form.create(curLink);
                resource.links.push(newForm);
                resource.save();
            }
            assessment.resources.push(resource);
            assessment.save();
            curIndex += assessment.numAssessmentsPerUser;
            i = curIndex;
            lastIndex += assessment.numAssessmentsPerUser;
        }

        // assign users if researcher has added users in drop
        let users = req.body.users;
        
        if(users) {
            let resourceIDs = [];
            assessment.resources.forEach(function(resource) {
                resourceIDs.push(resource._id);
            });

            // handle multiple users passed through drop down list
            if(Array.isArray(users)) {
                let index = 0;
                for await (let curUser of users) {
                    let curResourceID = resourceIDs[index];
                    let resource = await Resource.findById(curResourceID);
                    let currentUser = await User.findOne( { username: curUser } );
                    resource.user.id = currentUser.id;
                    resource.user.username = currentUser.username;
                    resource.save();
                    index += 1;
                }
            } else {
                // handle single user passed from dropdown list
                let user = users;
                let currentUser = await User.findOne( { username: user });
                let curResourceID = resourceIDs[0];
                let resource = await Resource.findById(curResourceID);
                let userObj = {
                    id: currentUser.id,
                    username: currentUser.username
                }
                resource.user = userObj;
                resource.save();
            }
        }
        res.redirect(`/assessments/${assessment.id}`);
    },

    // show assessment
    async assessmentShow(req, res, next) {
        let assessment = await Assessment.findById(req.params.id).populate({
            path: 'resources links',
            populate: {
                path: 'links'
            }
        }).exec();
        res.render('assessments/show', { assessment });
    },

    // delete route
    async assessmentDestroy(req, res, next) {
        let assessment = await Assessment.findById(req.params.id);
        await assessment.remove();
        res.redirect('/assessments');
    }
}