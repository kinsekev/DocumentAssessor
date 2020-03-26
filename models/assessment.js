const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    title: String,
    description: String,
    instructions: String,
    numAssessmentsPerUser: Number,
    resources: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Researcher'
        }
    ]
});

module.exports = mongoose.model('Assessment', assessmentSchema);