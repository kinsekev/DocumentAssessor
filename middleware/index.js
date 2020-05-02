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
		// checks if user is logged in
		if(req.isAuthenticated()) {
			return next();
		}
		// redirects to /researchers/login if not logged in
		req.flash('error', 'You need to be logged in to do that!');
		res.redirect('/researchers/login');
	},
	checkIfResearcherExists: async(req, res, next) => {
		// find researcher by username
		let researcherExists = await Reseacher.findOne({ 'username': req.body.username });
		if(researcherExists) {
			// redirects if the researcher exists
			req.flash('error', 'A researcher with that username already exists');
			return res.redirect('back');
		}
		next();
	},
	checkAssessmentOwnership: async(req, res, next) => {
		// find assessment by id
		let assessmentExists = await Assessment.findById(req.params.id);
		if(assessmentExists) {
			// check logged in user id equals researcher id on assessment
			if(assessmentExists.researcher.id.equals(req.user._id)) {
				next();
			} else {
				// redicrects if not same researcher
				req.flash('error', 'You do not have permission to do that');
				return res.redirect(`/assessments/${assessmentExists.id}`);
			}
		} else {
			// redirects if assessment isn't found
			req.flash('error', "That assessment doesn't exist");
			return res.redirect('back');
		}
	},
	checkAssessmentStarted: async(req, res, next) => {
		// find the assessment by id
		let assessmentExists = await Assessment.findById(req.params.id);
		if(assessmentExists) {
			// check if the assessment has started
			if(!assessmentExists.started) {
				next();
			} else {
				// redirects if the assessment has started
				req.flash('error', 'Assessment has already started');
				return res.redirect(`/assessments/${assessmentExists.id}`);
			}
		} else {
			// redirects if assessment isn't found
			req.flash('error', "That assessment doesn't exist");
			return res.redirect('back');
		}
	},
	checkResourceStarted: async(req, res, next) => {
		// find the resource by id
		let resourceExists = await Resource.findById(req.params.resource_id);
		if(resourceExists) {
			// checks if the resource has started
			if(!resourceExists.started) {
				next();
			} else {
				// redirects if the resource has started
				req.flash('error', 'Resource has already started');
				return res.redirect('/assessments/' + req.params.id);
			}
		} else {
			req.flash('error', "That resource doesn't exist");
			return res.redirect('back');
		}
	},
	checkAssessmentCorrectLinks: async (req, res, next) => {
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
		// define total users allowed
		let totalUsers = resourceArr.length / linksPerUser;
		// define numUsers
		let numUsers;

		if(usersForm && usersForm.length > 0) {
			// multiple users passed
			if(Array.isArray(usersForm)) {
				numUsers = usersForm.length;
				// check if number of passed users is greater than allowed users
				if (numUsers > totalUsers) {
					// redirect if too many users passed
					return res.render('assessments/new', 
						{ 
							users, 'error':  'There are too many users assigned'
						});
				} else {
					next();
				}
			} else {
				// single user passed
				if (1 > totalUsers) {
					// redirect if there is one user and no resource links
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
	checkAssessmentUpdateCorrectLinks: async (req, res, next) => {
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
		// number links in text file
		let numLinks = resourceArr.length;
		// number links per user
		let numLinksPerUser = req.body.newAssess.numAssessmentsPerUser;
		// check if they are evenlt divisiable 
		if (numLinks % numLinksPerUser !== 0) {
			// redirect if not
			req.flash('error', "The number of links doesn't evenly divide amoung users")
			return res.redirect(`/assessments/${req.params.id}/edit`);
		}
		next();
	},
	checkAssessmentUpdateCorrectUsers: async(req, res, next) => {
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
			// if multiple users passed
			if(Array.isArray(usersForm)) {
				numUsers = usersForm.length;
				// check if number passed user is greater than number allowed users
				if (numUsers > totalUsers) {
					// redirect back if so
					req.flash('error', 'There are too many users assigned');
					return res.redirect(`/assessments/${req.params.id}/edit`);
				} else {
					next();
				}
			} else {
				// check for no resources passed
				if (1 > totalUsers) {
					// redirect back if no resources and 1 user
					req.flash('error', 'There are too many users assigned');
					return res.redirect(`/assessments/${req.params.id}/edit`);
				} else {
					next();
				}
			}
		} else {
			next();
		}
	},
	checkResourceCreateCorrectLinks: async(req, res, next) => {
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
		// find the assessment by id
		let assessment = await Assessment.findById(req.params.id);
		// number of links passed in text file
		let numLinks = resourceArr.length;
		// number of links per user
		let numLinksPerUser = assessment.numAssessmentsPerUser;
		// check if they are the same
		if (numLinks !== numLinksPerUser) {
			// redirect if they are not
			req.flash('error', "The number of links doesn't evenly divide amoung users");
			return res.redirect(`/assessments/${req.params.id}/resources/new`);
		}
		next();
	},
	checkResourceCreateCorrectUser: async(req, res, next) => {
		// define users from input
		let usersForm = req.body.user;
		// total users allowed
		let totalUsers = 1;
		// numUsers
		let numUsers;
		if(usersForm && usersForm.length > 0) {
			// multiple users passed
			if(Array.isArray(usersForm)) {
				numUsers = usersForm.length;
				// check if more than one user is assigned to a single resource
				if (numUsers > totalUsers) {
					// redirect back if so
					req.flash('error', 'There are too many users assigned to this resource');
					return res.redirect(`/assessments/${req.params.id}/resources/new`);
				} else {
					next();
				}
			} 
		} else {
			next();
		}
	},
	checkResourceUpdateCorrectLinks: async(req, res, next) => {
		if(req.body.deleteLinks && req.body.deleteLinks.length) {
            // read text file with resources on each line
            const fileStream = await fs.createReadStream(req.file.path);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });
            // create an array of resources
            let linksArr = [];
            for await (let line of rl) {
                linksArr.push(line);
			}
			// links to delete
			let deleteLinks = req.body.deleteLinks;
			// check if they are the same length
			if (linksArr.length !== deleteLinks.length) {
				// redirect back if they are not
				req.flash('error', 'The number of removed links does not match the number of links in file');
				return res.redirect(`/assessments/${req.params.id}/resources/${req.params.resource_id}/edit`);
			} else{
				next();
			}
		} else {
			next();
		}
	}
}