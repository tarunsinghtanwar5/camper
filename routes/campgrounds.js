const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');
const isLoggedIn = require('../middleware')
//validating server side so that no one can request from postman and all something that is broken
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/home', { camps });
}))

//create new
router.get('/new',isLoggedIn,(req, res) => { 
    res.render('campgrounds/new');
})

router.post('/',isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const camp = new Campground(req.body);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success','Successfully made a new campground');
    res.redirect(`/campgrounds/${camp._id}`)


}))

// details page

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('reviews').populate('author');  
    console.log(camp.author.username);
    console.log(camp.author);
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }  //populating reviews which had only objectid stored in campground
    res.render('campgrounds/details', { id, camp });
}))


//edit

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    req.flash('success', 'Successfully updated a new campground');
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp })
}))

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/campgrounds/${camp._id}`)
}))
//delete

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))


module.exports = router;