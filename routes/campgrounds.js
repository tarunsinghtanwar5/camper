const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground,isAuthor} = require('../middleware')


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
    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(req.user);
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }  //populating reviews which had only objectid stored in campground
    res.render('campgrounds/details', { id, camp });
}))


//edit

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp })
}))


router.put('/:id', isLoggedIn, isAuthor,validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{ ...req.body.campground });
    req.flash('success', 'Successfully updated a new campground');
   return res.redirect(`/campgrounds/${camp._id}`)
}));

//delete

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))


module.exports = router;