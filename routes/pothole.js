const express = require("express");
var router = express.Router();
const { addPothole, getAll, getSinglePothole } = require("../controllers/pothole")

router.post("/addPothole", addPothole)
router.get("/getAll", getAll)
router.get("/getSinglePothole/:id", getSinglePothole)
module.exports = router;