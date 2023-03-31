const mongoose = require("mongoose");
const volunteerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true]
    },
    lastName: {
        type: String,
    },
    message: {
        type: String
    },
    email: {
        type: String
    },
    mobile: {
        type: Number
    }
})

module.exports = mongoose.model("Volunteer", volunteerSchema);