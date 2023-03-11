const express = require("express");
const { addVolunteer } = require("../controllers/volunteerController");
var router = express.Router();

router.post("/addVolunteer", addVolunteer)

module.exports = router;