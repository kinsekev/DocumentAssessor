const Assessment = require('../models/assessment');
const Resource = require('../models/resource');
const User = require('../models/user');

module.exports = {

    async assignUser(req, res, next) {
        // define users from input
        let user = req.body.users;
        // find the user in the database
        let currentUser = await User.findOne( { username: user } );
        // find the resource
        let resource = await Resource.findById(req.params.resource_id);
        // set the user params
        resource.user.id = currentUser.id;
        resource.user.username = currentUser.username;
        // save the resource
        resource.save();
        // redirect back to assessments show
        res.redirect(`/assessments/${req.params.id}`);
    }
}