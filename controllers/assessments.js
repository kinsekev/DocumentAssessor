const fs = require('fs');
const readline = require('readline');
const Assessment = require('../models/assessment');
const Resource = require('../models/resource');
const Form = require('../models/form');
const users = require('../mock_data/users');

module.exports = {
    // index assessments
    async assessmentIndex(req, res, next) {
        let assessments = await Assessment.find({});
        res.render('assessments/index', { assessments });
    },

    // new assessments
    async assessmentNew(req, res, next) {
        res.render('assessments/new');
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
                let curLink = {link : resourceArr[j]};
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
        res.render('assessments/show', { assessment, users });
    },

    // delete route
    async assessmentDestroy(req, res, next) {
        let assessment = await Assessment.findById(req.params.id);
        await assessment.remove();
        res.redirect('/assessments');
    }
}