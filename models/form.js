const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    link: String,
    text: String,
    rating: Number,
    started: Boolean
});

module.exports = mongoose.model('Form', formSchema);