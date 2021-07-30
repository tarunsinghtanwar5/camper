const { campgroundSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
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
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permissions to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}