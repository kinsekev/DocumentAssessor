const Assessment = require('../models/assessment');

module.exports = {
	asyncErrorHandler: (fn) =>
		(req, res, next) => {
			Promise.resolve(fn(req, res, next))
						 .catch(next);
	},
	isLoggedIn(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		}
		res.redirect('/researchers/login');
	},
	async checkAssessmentOwnership(req, res, next) {
		if(req.isAuthenticated()) {
			let assessment = await Assessment.findById(req.params.id);
            if(assessment) {
                if(assessment.researcher.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }
            } else {
                res.redirect('back');
            }
        } else {
            res.redirect('back');
        }
	}
}