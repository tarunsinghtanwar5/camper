const { campgroundSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const { reviewSchema } = require('./schemas.js');
const Review = require('./models/review.js');


//validating server side so that no one can request from postman and all something that is broken

module.exports.isLoggedIn=(req,res,next)=>{
    if (!req.isAuthenticated()) {
    req.flash('error', 'You need to sign in first')
        req.session.returnTo = req.originalUrl;
    return res.redirect('/login');
}
next();
}
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp.author.equals(req.user.id)) {
        req.flash('error', 'You dont have permissions to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id,reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user.id)) {
        req.flash('error', 'You dont have permissions to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
