const Assessment = require('../models/assessment');
const Resource = require('../models/resource');
const Form = require('../models/form');
const User = require('../models/user');

module.exports = {

    // update resource by assigning user
    async resourceUserUpdate(req, res, next) {
        // Find the user in the database
        let user = req.body.assignUser;
        let currentUser = await User.findOne({ username: user });
        // create user object
        let userObj = {
            id: currentUser.id,
            username: currentUser.username
        }
        // Find the resource in the database
        let resource = await Resource.findByIdAndUpdate(req.params.resource_id, userObj);
        resource.user = userObj;
        resource.save();
        res.redirect(`/assessments/${req.params.id}`);
    },

    // update resource by removing user
    async resourceUserRemove(req, res, next) {
        let updatedResource = await Resource.findByIdAndUpdate(req.params.resource_id, { user: undefined } );
        res.redirect(`/assessments/${req.params.id}`);
    }
}