const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const session = require('express-session')
const flash=require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User= require('./models/user');
const userRoutes = require('./routes/users');
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

//passport default code to set up
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





//middlware to use success on every route 
app.use((req, res,next) => {
	// if(!['/login', '/register', '/'].includes(req.originalUrl)) {
	// 	req.session.returnTo = req.originalUrl;
	// }
	res.locals.success=req.flash('success')
	res.locals.error=req.flash('error')
	res.locals.currentUser=req.user;
	next();
})

//for routes path
app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
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
