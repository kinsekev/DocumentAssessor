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
        // create a new resource for each one in text file and push it to the assessment
        for await (const line of rl) {
            let newResource = {link: line};
            let resource = await Resource.create(newResource);
            assessment.resources.push(resource);
            assessment.save();
        }
        res.redirect(`/assessments/${assessment.id}`);
    },

    // show assessment
    async assessmentShow(req, res, next) {
        let assessment = await Assessment.findById(req.params.id).populate('resources').exec();
        res.render('assessments/show', { assessment, users });
    },

    // delete route
    async assessmentDestroy(req, res, next) {
        let assessment = await Assessment.findById(req.params.id);
        await assessment.remove();
        res.redirect('/assessments');
    }
}