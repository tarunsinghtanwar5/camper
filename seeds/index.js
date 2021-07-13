const mongoose = require('mongoose');
const cities = require('./cities')
const { places, descriptors } = require('./seedhelpers');
const db = mongoose.connection;
const Campground = require('../models/campground');
mongoose
    .connect('mongodb://localhost:27017/camper', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MONGO CONNECTION OPEN!!!');
    })
    .catch((err) => {
        console.log('OH NO MONGO CONNECTION ERROR!!!!');
        console.log(err);
    });


const randArray = (arr) => arr[Math.floor(Math.random() * arr.length)]     //returns a random element from the array passed
// adding seed data with random names from the files
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomLocation = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[randomLocation].city}, ${cities[randomLocation].state}`,
            title: `${randArray(descriptors)} ${randArray(places)}`
        })

        await camp.save();
    }
}











seedDB();