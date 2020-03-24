const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = mongoose.Schema({
    username: String,
    password: String,
    isResearcher: Boolean
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);