const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    link: String
});

module.exports = mongoose.model('Resource', resourceSchema);