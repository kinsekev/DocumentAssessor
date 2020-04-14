const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    task: String,
    links: [
        String
    ],
    forms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Form'
        }
    ],
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    started: Boolean
});

module.exports = mongoose.model('Resource', resourceSchema);