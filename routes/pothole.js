const express = require("express");
var router = express.Router();
const { addPothole, getAll } = require("../controllers/pothole")

router.post("/addPothole", addPothole)
router.get("/getAll", getAll)

module.exports = router;