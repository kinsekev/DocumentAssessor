const Assessment = require('../models/assessment');
const Resource = require('../models/resource');
const Reseacher = require('../models/researcher');
const User = require('../models/user');
const fs = require('fs');
const readline = require('readline');

module.exports = {
	asyncErrorHandler: (fn) =>
		(req, res, next) => {
			Promise.resolve(fn(req, res, next))
						 .catch(next);
	},
	isLoggedIn: (req, res, next) => {
		if(req.isAuthenticated()) {
			return next();
		}
		req.flash('error', 'You need to be logged in to do that!');
		res.redirect('/researchers/login');
	},
	checkIfResearcherExists: async (req, res, next) => {
		let researcherExists = await Reseacher.findOne({ 'username': req.body.username });
		if(researcherExists) {
			req.flash('error', 'A researcher with that username already exists');
			return res.redirect('back');
		}
		next();
	},
	checkAssessmentOwnership: async (req, res, next) => {
		let assessmentExists = await Assessment.findById(req.params.id);
		if(assessmentExists) {
			if(assessmentExists.researcher.id.equals(req.user._id)) {
				next();
			} else {
				req.flash('error', 'You do not have permission to do that');
				return res.redirect(`/assessments/${assessmentExists.id}`);
			}
		} else {
			req.flash('error', "That assessment doesn't exist");
			return res.redirect('back');
		}
	},
	checkAssessmentStarted: async (req, res, next) => {
		let assessmentExists = await Assessment.findById(req.params.id);
		if(assessmentExists) {
			if(!assessmentExists.started) {
				next();
			} else {
				req.flash('error', 'Assessment has already started');
				return res.redirect(`/assessments/${assessmentExists.id}`);
			}
		} else {
			req.flash('error', "That assessment doesn't exist");
			return res.redirect('back');
		}
	},
	checkResourceStarted: async (req, res, next) => {
		// find the resource by id
		let resourceExists = await Resource.findById(req.params.resource_id);
		if(resourceExists) {
			if(!resourceExists.started) {
				next();
			} else {
				req.flash('error', 'Resource has already started');
				return res.redirect('/assessments/' + req.params.id);
			}
		} else {
			req.flash('error', "That resource doesn't exist");
			return res.redirect('back');
		}
	},
	checkAssessmentHasCorrectLinks: async (req, res, next) => {
		// find all the users in the database
		let users = await User.find({});
		// read text file with resources on each line
        const fileStream = await fs.createReadStream(req.file.path);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        // create an array of resources
        let resourceArr = [];
        for await (let line of rl) {
            resourceArr.push(line);
		}
		// variables
		let numLinks = resourceArr.length;
		let numLinksPerUser = req.body.assessment.numAssessmentsPerUser;
		if (numLinks % numLinksPerUser !== 0) {
			return res.render('assessments/new', 
				{ 
					users, 'error': "The number of links doesn't evenly divide amoung users" 
				});
		}
		next();
	},
	checkAssessmentCorrectUsers: async (req, res, next) => {
		// find all the users in the database
		let users = await User.find({});
		// read text file with resources on each line
        const fileStream = await fs.createReadStream(req.file.path);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        // create an array of resources
        let resourceArr = [];
        for await (let line of rl) {
            resourceArr.push(line);
		}
		// define users from input
		let usersForm = req.body.users;
		// define links per user
		let linksPerUser = req.body.assessment.numAssessmentsPerUser;
		// total users allowed
		let totalUsers = resourceArr.length / linksPerUser;
		// numUsers
		let numUsers;

		if(usersForm && usersForm.length > 0) {
			if(Array.isArray(usersForm)) {
				numUsers = usersForm.length;
				if (numUsers > totalUsers) {
					return res.render('assessments/new', 
						{ 
							users, 'error':  'There are too many users assigned'
						});
				} else {
					next();
				}
			} else {
				if (1 > totalUsers) {
					req.flash('error', 'There are too many users assigned');
					return res.render('assessments/new', 
						{ 
							users, 'error':  'There are too many users assigned'
						});
				} else {
					next();
				}
			}
		} else {
			next();
		}
	},
	checkAssessmentEditHasCorrectLinks: async (req, res, next) => {
		// find all the users in the database
		let users = await User.find({});
		// read text file with resources on each line
        const fileStream = await fs.createReadStream(req.file.path);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        // create an array of resources
        let resourceArr = [];
        for await (let line of rl) {
            resourceArr.push(line);
		}
		// variables
		let numLinks = resourceArr.length;
		let numLinksPerUser = req.body.newAssess.numAssessmentsPerUser;
		if (numLinks % numLinksPerUser !== 0) {
			req.flash('error', "The number of links doesn't evenly divide amoung users")
			return res.redirect(`/assessments/${req.params.id}/edit`);
		}
		next();
	},
	checkAssessmentEditCorrectUsers: async (req, res, next) => {
		// find all the users in the database
		let users = await User.find({});
		// read text file with resources on each line
        const fileStream = await fs.createReadStream(req.file.path);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        // create an array of resources
        let resourceArr = [];
        for await (let line of rl) {
            resourceArr.push(line);
		}
		// define users from input
		let usersForm = req.body.users;
		// define links per user
		let linksPerUser = req.body.newAssess.numAssessmentsPerUser;
		// total users allowed
		let totalUsers = resourceArr.length / linksPerUser;
		// numUsers
		let numUsers;

		if(usersForm && usersForm.length > 0) {
			if(Array.isArray(usersForm)) {
				numUsers = usersForm.length;
				if (numUsers > totalUsers) {
					req.flash('error', 'There are too many users assigned');
					return res.redirect(`/assessments/${req.params.id}/edit`);
				} else {
					next();
				}
			} else {
				if (1 > totalUsers) {
					req.flash('error', 'There are too many users assigned');
					return res.redirect(`/assessments/${req.params.id}/edit`);
				} else {
					next();
				}
			}
		} else {
			next();
		}
	}
}