const Campground = require('../models/campground');
const Review = require('../models/review.js');
const User = require('../models/user');

module.exports.userRender = (req, res) => {
    res.render('users/register')
}
module.exports.userRegister = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Camper')
            res.redirect('/campgrounds');
        });

    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('register')
    }
}
module.exports.userLoginRegister = (req, res) => {
    res.render('users/login');
}
module.exports.userLogin = (req, res) => {
    req.flash('success', 'Welcome Back')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo;
    res.redirect(redirectUrl);

}
module.exports.userLogout = (req, res) => {
    req.logout();
    req.flash('success', 'Logged out')
    res.redirect('/login')
}
