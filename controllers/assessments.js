const fs = require('fs');
const readline = require('readline');
const Assessment = require('../models/assessment');
const Resource = require('../models/resource');

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
        // create a new resource for each one in text and push it to the assessment
        for(const line of rl) {
            let newResource = {link: line};
            let resource = await Resource.create(newResource);
            assessment.resources.push(resource);
            assessment.save();
            console.log(resource);
        }
        res.redirect(`/assessments/${assessment.id}`);
    },

    // show assessment
    async assessmentShow(req, res, next) {
        let assessment = await Assessment.findById(req.params.id);
        res.render('assessments/show', { assessment, users: users });
    },

    // delete route
    async assessmentDestroy(req, res, next) {
        let assessment = await Assessment.findById(req.params.id);
        await assessment.remove();
        res.redirect('/assessments');
    }
}