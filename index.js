const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect("mongodb://localhost:27017/pothole", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
})

const authRoutes = require("./routes/auth");
const addRoutes = require("./routes/pothole");

app.use("/api", authRoutes);
app.use("/api", addRoutes);

app.listen(9002,() => {
    console.log("BE started at port 9002")
})