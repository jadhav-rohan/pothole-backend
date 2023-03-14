const mongoose = require("mongoose");
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

module.exports = mongoose.model("Volunteer", volunteerSchema);