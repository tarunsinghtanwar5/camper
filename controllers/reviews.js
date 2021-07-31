const Review = require('../models/review.js');
const Campground = require('../models/campground');
module.exports.reviewCreate = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Created New Review');
    res.redirect(`/campgrounds/${camp._id}`);
}
module.exports.reviewDelete = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted review');
    res.redirect(`/campgrounds/${id}`)
}