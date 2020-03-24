const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    title: String,
    description: String,
    instructions: String,
    numAssessmentsPerUser: Number,
    resources: [
        {
            link: String
        }
    ]
});

module.exports = mongoose.model('Assessment', assessmentSchema);