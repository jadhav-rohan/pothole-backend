const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

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
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    },
    mobile: {
        type: String
    }
})

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, 'secret' , {
		expiresIn: "7d",
	});
	return token;
};
module.exports = mongoose.model("User", userSchema);
