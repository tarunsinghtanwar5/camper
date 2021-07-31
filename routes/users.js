const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const users = require('../controllers/users')


router.route('/register')
    .get(users.userRender)
    .post(users.userRegister)

router.route('/login')
    .get(users.userLoginRegister)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.userLogin)

router.get('/logout', users.userLogout)

module.exports = router;