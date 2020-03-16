const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    title: String,
    description: String
});

module.exports = mongoose.model('Assessment', assessmentSchema);