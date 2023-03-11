const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide unique username"],
        unique: [true, "Username Exists"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique: false,
    },
    email: {
        type: String,
        required: [true, "Please provide a unique email"],
        unique: true,
    },
    mobile: {
        type: Number
    }
})

const volunteerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true]
    },
    email: {
        type: String
    },
    mobile: {
        type: Number
    }
})


module.exports = mongoose.model("User", userSchema);
module.exports = mongoose.model("Volunteer", volunteerSchema);