const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    task: String,
    links: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Form'
        }
    ]
});

module.exports = mongoose.model('Resource', resourceSchema);