const mongoose = require("mongoose");

const Blogs = new mongoose.Schema({
    title:{
        type: String,
    },
    description:{
        type: String,
        // required: true
    },
    date:{
        type: String,
        // required: true
    },
    author:{
        type: String,
        // required: true
    },
    time:{
        type: String,
        // required: true
    },
    image:{
        type: Object
    }
})

module.exports =  mongoose.model("blogs", Blogs)