const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
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
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//index page 
app.get('/campgrounds',async (req,res)=>{
	const camps= await Campground.find({});
    res.render('campgrounds/home',{camps});
})



// details page

app.get('/campgrounds/:id',async (req,res)=>{
	const { id } = req.params;
	const camp= await Campground.findById(id);
res.render('campgrounds/details',{id,camp});
})


//edit

app.get('/campgrounds/:id/edit', async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findById(id);
	res.render('campgrounds/edit', { camp })
})

app.put('/campgrounds/:id',async (req,res)=>{
	const { id } = req.params;
	const camp = await Camp.findByIdAndUpdate(id, { ...req.body});
	res.redirect(`/campgrounds/${camp._id}`)
})








app.listen(3000, () => {
	console.log('Listening to port 3000');
});
