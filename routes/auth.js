const express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const { login, signup, signout, resetPassword, forgetPassword, resetPasswordPost, verify } = require("../controllers/authController");

router.post("/signup",
[
  check("name", "name should be at least 3 char").isLength({ min: 3 }),
  check("email", "email is required").isEmail(),
  check("password", "password should be at least 3 char").isLength({
    min: 3,
  }),
],signup );

router.post("/login",
[
  check("email", "email is required").isEmail(),
  check("password", "password field is required").isLength({ min: 1 }),
],
login);

router.get("/signout", signout);   

router.get("/reset-password/:id/:token", resetPassword);
router.post("/forget-password", forgetPassword)
router.post("/reset-password/:id/:token", resetPasswordPost);

router.get("/:id/verify/:token/", verify)

module.exports = router;
