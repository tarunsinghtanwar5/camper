if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config();
}

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
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
var dbUrl=process.env.DB_URL;
const MongoDBStore = require('connect-mongo')(session);
dbUrl=process.env.DB_URL||'mongodb://localhost:27017/camper';
mongoose
	.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true,useFindAndModify:false })
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
app.use(mongoSanitize());
app.use(helmet({contentSecurityPolicy:false}));

//session
const secret = process.env.SECRET || 'thisisnotasecret'
const store = new MongoDBStore({
	url: dbUrl,
	secret,
	touchAfter: 24 * 60 * 60
});
store.on("error", function (e) {
	console.log("SESSION STORE ERROR", e)
})

const sessionConfig ={
	store,
	name:'session',
	secret,
	resave:false,
	saveUninitialized:true,
	cookie:{
		httpOnly:true,
		//secure:true,
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
app.use((req,res,next) => {
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
app.use('/',(req, res,)=>{
	res.render('main')
})
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Serving on port ${port}`)
})

