const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    title: String,
    description: String,
    instructions: String,
    numLinksPerUser: Number,
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
    },
    totalNumLinks: Number,
    totalLinksCompleted: Number,
    percentageComplete: {
        type: Number,
        default: 0
    }
});

assessmentSchema.methods.calPercentComp = function() {
    this.percentageComplete = Math.floor((this.totalLinksCompleted / this.totalNumLinks) * 100);
    this.save();
    return this.percentageComplete;
}

module.exports = mongoose.model('Assessment', assessmentSchema);