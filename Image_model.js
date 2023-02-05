import mongoose from "mongoose";

const ImageSchema = mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    pincode:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    image:{
        data: Buffer,
        contentType: String 
    }
})

module.exports = ImageModel = mongoose.model('imageModel', ImageSchema);