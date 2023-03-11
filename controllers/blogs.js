const { findOne } = require("../models/blogs");
const Blog = require("../models/blogs")
const cloudinary = require("../utils/cloudinary");


exports.addBlog = async (req, res) => {
    const { title, description, author, time, date, image } = req.body;

  try {
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "blogs",
      });

      if (uploadedResponse) {
        const blog = new Blog({
          title,
          description,
          author,
          time,
          date,
          image: uploadedResponse,
        });

        const savedBlog = await blog.save();
        res.status(200).send(savedBlog);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

exports.getAllBlogs =  async (req, res) => {
    const qbrand = req.query.brand;
    try {
      let blogs;
  
      if (qbrand) {
        blogs = await Blog.find({
          brand: qbrand,
        });
      } else {
        blogs = await Blog.find();
      }
  
      res.status(200).send(blogs);
    } catch (error) {
      res.status(500).send(error);
    }
};

exports.getSingleBlog = async (req, res) => {
  const _id = req.params.id;
  try{
    Blog.findOne({_id : _id}).then(data => {
      return res.status(200).send({
        data: data
      })
    })
  }catch(err){console.log("blog not found")}
}
