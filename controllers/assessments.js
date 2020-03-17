const fs = require('fs');
const { promisify } = require('util');
const Assessment = require('../models/assessment');
const readFileAsync = promisify(fs.readFile);

module.exports = {
    // index assessments
    async assessmentIndex(req, res, next) {
        let assessments = await Assessment.find({});
        res.render('assessments/index', { assessments });
    },

    // new post
    async assessmentNew(req, res, next) {
        res.render('assessments/new');
    },

    // create assessment
    async assessmentCreate(req, res, next) {
        let resources = await readFileAsync(req.file.path);
        resources = resources.toString().split(',');
        req.body.assessment.resources = [];
        for(const link of resources) {
            req.body.assessment.resources.push({
                link: link
            });
        }
        let assessment = await Assessment.create(req.body.assessment);
        res.redirect(`/assessments/${assessment.id}`);
    },

    // show assessment
    async assessmentShow(req, res, next) {
        let assessment = await Assessment.findById(req.params.id);
        res.render('assessments/show', { assessment });
    }
}