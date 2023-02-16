const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    // name: String,
    // email: String,
    // password: String

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

module.exports = mongoose.model("User", userSchema);