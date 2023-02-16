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
    }
})

module.exports =  mongoose.model("potholes", Pothole)