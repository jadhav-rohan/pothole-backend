const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path =  require("path");

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose.connect("mongodb://localhost:27017/pothole", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
})

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