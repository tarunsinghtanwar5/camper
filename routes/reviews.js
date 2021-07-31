const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { validateReview, isLoggedIn,isReviewAuthor } = require('../middleware')
const Review = require('../models/review.js');
const Campground = require('../models/campground');
const reviews = require('../controllers/reviews')

router.post('/', validateReview, isLoggedIn, catchAsync(reviews.reviewCreate))
//delete review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.reviewDelete))

module.exports = router;