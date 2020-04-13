const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    task: String,
    links: [
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
    }
});

module.exports = mongoose.model('Resource', resourceSchema);