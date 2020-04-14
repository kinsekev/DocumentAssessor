const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    link: String,
    text: String,
    rating: Number
});

module.exports = mongoose.model('Form', formSchema);