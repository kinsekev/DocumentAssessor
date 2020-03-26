const fs = require('fs');
const readline = require('readline');
const Assessment = require('../models/assessment');
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
        const fileStream = await fs.createReadStream(req.file.path);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
          });
          req.body.assessment.resources = [];
          for await (const line of rl) {
            req.body.assessment.resources.push({
                link: line
            });
          }
        let assessment = await Assessment.create(req.body.assessment);
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