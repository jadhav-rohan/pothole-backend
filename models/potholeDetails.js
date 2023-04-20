const mongoose = require("mongoose");

const Pothole = new mongoose.Schema({
    email:{
        type: String,
    },
    address:{
        type: String,
        // required: true
    },
    pincode:{
        type: String,
        // required: true
    },
    city:{
        type: String,
        // required: true
    },
    state:{
        type: String,
        // required: true
    },
    image:{
        type: Object
    },
    latitude: {
        type: String,
    },
    longitude: {
        type: String,
    },
    street: {
        type: String,
    },
    sublocality: {
        type: String
    }
})

module.exports =  mongoose.model("potholes", Pothole)