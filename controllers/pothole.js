const Pothole = require("../models/potholeDetails");
const cloudinary = require("../utils/cloudinary");


exports.addPothole = async (req, res) => {
    const { email, address, city, state, pincode, image, street, lat, lng, subLocality } = req.body;

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
          latitude: lat,
          longitude: lng,
          sublocality: subLocality,
          street: street,
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

exports.getSinglePothole = async (req, res) => {
    const _id = req.params.id;
    try{
      Pothole.findOne({_id : _id}).then(data => {
        return res.status(200).send({
          data: data
        })
      })
    }catch(err){console.log("pothole not found")}
}