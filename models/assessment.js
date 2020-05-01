const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    title: String,
    description: String,
    instructions: String,
    numAssessmentsPerUser: Number,
    started: Boolean,
    resources: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Resource'
        }
    ],
    researcher: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Researcher'
        },
        username: String
    }
});

module.exports = mongoose.model('Assessment', assessmentSchema);