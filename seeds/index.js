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
    for (let i = 0; i < 400; i++) {
        const randomLocation = Math.floor(Math.random() * 1000);
        var price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "6102b80b653aa03bfcedb7bc",
            location: `${cities[randomLocation].city}, ${cities[randomLocation].state}`,
            title: `${randArray(descriptors)} ${randArray(places)}`, 
            images: [
                {
                    
                    url: 'https://res.cloudinary.com/camperimg/image/upload/v1627907576/Camper/nvpgag5lu90jq6o9ay8k.jpg',
                    filename: 'Camper/hbnixuafv89um5oedtne'
                },
                {
                    
                    url: 'https://res.cloudinary.com/camperimg/image/upload/v1627907661/Camper/i1ne0jpskix842bi9bfw.jpg',
                    filename: 'Camper/clepanvzrybxxpmgsbzf'
                }
               
            ]
,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[randomLocation].longitude,
                    cities[randomLocation].latitude
                ]
            }
        })

        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

