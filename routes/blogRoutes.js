const express = require("express");
const { isAdmin, isAuthenticated } = require("../controllers/authController");
const { addBlog, getAllBlogs, getSingleBlog, editBlog } = require("../controllers/blogs");
var router = express.Router();



router.post("/addBlog", addBlog)
router.get("/getAllBlogs", getAllBlogs)
router.get("/getSingleBlog/:id", getSingleBlog)
router.put("/:id", editBlog)
module.exports = router;