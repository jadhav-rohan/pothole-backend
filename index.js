import express from "express"
import cors from "cors"
import mongoose, { mongo } from "mongoose"
import bcrypt from "bcrypt";
import multer, { diskStorage } from "multer";
// import bodyParser from "bodyParser"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
// app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/pothole", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
})

//Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const ImageSchema = new mongoose.Schema({
    email:{
        type: String,
        // required: true,
        default: ""
    },
    address:{
        type: String,
        default: "",
        // required: true
    },
    pincode:{
        type: String,
        default: "",
        // required: true
    },
    city:{
        type: String,
        default: "",
        // required: true
    },
    state:{
        type: String,
        default: "",
        // required: true
    },
    image:{
        data: Buffer,
        contentType: String 
    }
})

//Model
const User = new mongoose.model("User", userSchema)
const ImageModel = new mongoose.model("imageModel", ImageSchema);

//storage
const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage:Storage
}).single('testImage')

// app.use(multer({ storage : Storage}).fields([{name:'testImage',maxCount:1}]));

//Routes
app.post("/add", (req, res, next) => {
    upload(req, res, (err) => {
        if(err){
            console.log(err)
        }
        else{
            const newImage = new ImageModel({
                email: req.body.email,
                address: req.body.address,
                pincode: req.body.pincode,
                city: req.body.city,
                state: req.body.state,
                image: {
                    data: req.file.filename,
                    contentType: "image/jpg"
                }
            })
            newImage.save()
            .then(() => res.send("Sucessfully Uploaded!"))
            .catch(err => console.log(err))
        }
    })
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