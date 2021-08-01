const Campground = require('../models/campground');

module.exports.campHome=async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/home', { camps });
}

module.exports.campNew=(req, res) => {
    res.render('campgrounds/new');
}
module.exports.campCreate = async (req, res, next) => {

    const geoDATA=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send();
    console.log(geoDATA);
    const camp = new Campground(req.body.campground);
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    console.log(camp)

    const camp = new Campground(req.body);

    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${camp._id}`)


}
module.exports.campDetails = async (req, res) => {
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
}
module.exports.campEditRender = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp })
}
module.exports.campEdit = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated a new campground');
    return res.redirect(`/campgrounds/${camp._id}`)
}
module.exports.campDelete = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}