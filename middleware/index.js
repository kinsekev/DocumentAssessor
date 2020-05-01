const Assessment = require('../models/assessment');
const Resource = require('../models/resource');
const Reseacher = require('../models/researcher');

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
	} 
}