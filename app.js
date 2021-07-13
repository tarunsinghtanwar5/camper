const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const db = mongoose.connection;
const Campground = require('./models/campground');
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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))



app.get('/',(req,res)=>{
    res.render('home');
})















app.listen(3000, () => {
	console.log('Listening to port 3000');
});
