const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const session = require('express-session')
const flash=require('connect-flash')
mongoose
	.connect('mongodb://localhost:27017/camper', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true,useFindAndModify:false })
	.then(() => {
		console.log('MONGO CONNECTION OPEN!!!');
	})
	.catch((err) => {
		console.log('OH NO MONGO CONNECTION ERROR!!!!');
		console.log(err);
	});

const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//session
const sessionConfig ={
	secret: 'thisisnotasecret',
	resave:false,
	saveUninitialized:true,
	cookie:{
		httpOnly:true,
		expires:Date.now()+ 1000*60*60*24*7, // in 7 days, all the calculations are in miliseconds because data.now returns in miliseconds
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}
app.use(session(sessionConfig));
app.use(flash());
//middlware to use success on every route 
app.use((req, res,next) => {
	res.locals.success=req.flash('success')
	res.locals.error=req.flash('error')
	next();
})

//for routes path
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
app.use(express.static(path.join(__dirname, 'public')))

//Review post

app.all('*', (req, res, next) => {
	next(new ExpressError('Page not found', 404));
});
//this is to throw errors
app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Oh No, Something Went Wrong!';
	res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
	console.log('Listening to port 3000');
});
