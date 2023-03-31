const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path =  require("path");
const router = express.Router();
const app = express()

// app.use(express.json())
// app.use(express.urlencoded())
app.use(cors())
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
// app.use(express.urlencoded({ extended: false }));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json({limit: "10mb", extended: true}))
app.use(express.urlencoded({limit: "10mb", extended: true, parameterLimit: 50000}))



// mongoose.connect("mongodb://localhost:27017/pothole", {
mongoose.connect("mongodb+srv://rohan:mongodb2023@cluster0.3dejqga.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
})

const axios = require('axios');
const authRoutes = require("./routes/auth");
const addRoutes = require("./routes/pothole");
const volunteerRoute = require("./routes/volunteer")
const blogRoute = require("./routes/blogRoutes")

app.use("/api", authRoutes);
app.use("/api", addRoutes);
app.use("/api", volunteerRoute);
app.use("/api", blogRoute);

app.listen(9002,() => {
    console.log("BE started at port 9002")
})