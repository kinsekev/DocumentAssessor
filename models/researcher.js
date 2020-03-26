const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const ResearcherSchema = mongoose.Schema({
    username: String,
    password: String
});

ResearcherSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Researcher', ResearcherSchema);