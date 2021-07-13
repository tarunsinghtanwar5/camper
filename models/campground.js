const mongoose = require('mongoose');
const schema=mongoose.schema;

const CamgroundSchema =new schema({
    title: String,
    price: String,
    description: String,
    location: String
})

module.exports =mongoose.model('Campground',CamgroundSchema);