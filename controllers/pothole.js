const Pothole = require("../models/potholeDetails");
const cloudinary = require("../utils/cloudinary");


exports.addPothole = async (req, res) => {
    const { email, address, city, state, pincode, image } = req.body;

  try {
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "potholeHero",
      });

      if (uploadedResponse) {
        const pothole = new Pothole({
          email,
          address,
          city,
          state,
          pincode,
          image: uploadedResponse,
        });

        const savedPothole = await pothole.save();
        res.status(200).send(savedPothole);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

exports.getAll =  async (req, res) => {
    const qbrand = req.query.brand;
    try {
      let potholes;
  
      if (qbrand) {
        potholes = await Pothole.find({
          brand: qbrand,
        });
      } else {
        potholes = await Pothole.find();
      }
  
      res.status(200).send(potholes);
    } catch (error) {
      res.status(500).send(error);
    }
  };

