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
			// check if researcher is logged in
			if(req.isAuthenticated()) {
				// find the assessment by id
				let assessment = await Assessment.findById(req.params.id);
				if(assessment) {
					// check that the researcher owns the assessment
					if(assessment.researcher.id.equals(req.user._id)) {
						next();
					} else {
						// redirect back
						res.redirect('back');
					}
				} else {
					// redirect back
					res.redirect('back');
				}
			} else {
				// redirect back
				res.redirect('back');
		}
	}
}