const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const db = mongoose.connection;
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const catchAsync=require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema } = require('./schemas.js');
mongoose
	.connect('mongodb://localhost:27017/camper', { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('MONGO CONNECTION OPEN!!!');
	})
	.catch((err) => {
		console.log('OH NO MONGO CONNECTION ERROR!!!!');
		console.log(err);
	});

const app = express();
app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)
	} else {
		next();
	}
}


//index page 
app.get('/campgrounds', catchAsync(async (req,res)=>{
	const camps= await Campground.find({});
    res.render('campgrounds/home',{camps});
}))

//create new
app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new');
})

app.post('/campgrounds', validateCampground, catchAsync(async (req, res,next) => {
	
	const camp = new Campground(req.body);
	await camp.save();
	res.redirect(`/campgrounds/${camp._id}`)
	
	
}))

// details page

app.get('/campgrounds/:id', catchAsync(async (req,res)=>{
	const { id } = req.params;
	const camp= await Campground.findById(id);
res.render('campgrounds/details',{id,camp});
}))


//edit

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findById(id);
	res.render('campgrounds/edit', { camp })
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req,res)=>{
	const { id } = req.params;
	const camp = await Campground.findByIdAndUpdate(id, { ...req.body});
	res.redirect(`/campgrounds/${camp._id}`)
}))
//delete

app.delete('/campgrounds/:id', catchAsync(async (req,res)=>{
	const {id } = req.params;
	await Campground.findByIdAndDelete(id);
	res.redirect('/campgrounds');
}))
app.all('*',(req,res,next)=>{
	next(new ExpressError('Page not found',404));
})
//this is to throw errors
app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Oh No, Something Went Wrong!'
	res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
	console.log('Listening to port 3000');
});
