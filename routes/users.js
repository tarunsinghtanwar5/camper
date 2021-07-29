const express = require('express');
const router = express.Router();
const passport = require('passport');
const User= require('../models/user');


router.get('/register',(req, res)=>{
    res.render('users/register')
})

router.post('/register',async (req, res,next)=>{
    try{
    const {username, password,email} = req.body;
    const user= new User({email,username});
    const registeredUser=await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err) return next(err);
            req.flash('success', 'Welcome to Camper')
            res.redirect('/campgrounds');
        });
    
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('register')
    }
})

//login
router.get('/login',(req,res)=>{
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),(req,res)=>{
    req.flash('success','Welcome Back')
    const redirectUrl =req.session.returnTo || '/campgrounds'
    delete req.session.returnTo;
    res.redirect(redirectUrl);
   
})
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged out')
    res.redirect('/login')
})

module.exports = router;