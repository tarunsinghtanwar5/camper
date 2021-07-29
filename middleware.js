const isLoggedIn=(req,res,next)=>{
    if (!req.isAuthenticated()) {
    req.flash('error', 'You need to sign in first')
        req.session.returnTo = req.originalUrl;
    return res.redirect('/login');
}
next();
}

module.exports = isLoggedIn;