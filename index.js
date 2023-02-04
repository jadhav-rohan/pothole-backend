import express from "express"
import cors from "cors"
import mongoose, { mongo } from "mongoose"
import bcrypt from "bcrypt";
import multer from "multer";
// const asyncHandler = require("express-async-handler");

import formidable from "formidable"
import _ from "lodash"
import fs from "fs"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/pothole", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const potholeScheme = new mongoose.Schema({
    email: String,
    address: String,
    pincode: Number,
    city: String,
    state: String,
    potholeImage: String
})

const User = new mongoose.model("User", userSchema)
const potholes = new mongoose.model("DetailsPot", potholeScheme)

//Functions
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "../frontend/public/uploads")
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
})

const upload = multer({storage: storage})

//Routes
app.post("/add",upload.single("potholeImage"), (req, res) => {
    // const newPot = new potholes({
    //     email: req.body.email,
    //     address: req.body.address,
    //     pincode: req.body.pincode,
    //     city: req.body.city,
    //     state: req.body.state,
    //     potholeImage: req.file.potholeImage
    // })

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }
    //destructure the fields
    const { email, address, pincode,city,state } = fields;

    if (!email || !address || !pincode || !city || !state) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let pothole = new potholes(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      pothole.photo.data = fs.readFileSync(file.photo.path);
      pothole.photo.contentType = file.photo.type;
    }
    // console.log(product);

    //save to the DB
    product.save((err, pothole) => {
      if (err) {
        res.status(400).json({
          error: "Saving tshirt in DB failed",
        });
      }
      res.json(pothole);
    });
  });
})

app.post("/login", (req, res)=> {
    const { email, password} = req.body
    User.findOne({ email: email}, (err, user) => {
        if(user){
            if((bcrypt.compare(password, user.password))) {
                res.send({message: "Login Successfull", user: user})
            } else {
                res.send({ message: "Password didn't match"})
            }
        } else {
            res.send({message: "User not registered"})
        }
    })
}) 

app.post("/register", (req, res)=> {
    const { name, email, password} = req.body
    User.findOne({email: email}, (err, user) => {
        if(user){
            res.send({message: "User already registerd"})
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            const user = new User({
                name,
                email,
                password: hash
            })
            user.save(err => {
                if(err) {
                    res.send(err)
                } else {
                    res.send( { message: "Successfully Registered, Please login now." })
                }
            })
        }
    })
    
}) 

app.listen(9002,() => {
    console.log("BE started at port 9002")
})