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
    role: {
        type: Number
    }
})

module.exports = mongoose.model("User", userSchema);
