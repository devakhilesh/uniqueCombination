const BusImageModel = require("../models/busImageModel");
const cloudinary = require("cloudinary").v2;

exports.addBusImage = async (req, res) => {
  try {
    const data = req.body;
    const { busNumber } = data;
    if (!busNumber) {
      return res
        .status(400)
        .json({ status: false, message: "Bus number is required" });
    }
    const check = await BusImageModel.findOne({ busNumber: busNumber });

    if (check) {
      return res
        .status(400)
        .json({ status: false, message: "Bus number already exists" });
    }

    if (!req.files || !req.files.image) {
      return res
        .status(400)
        .json({ status: false, message: "Image is required" });
    }

    let image = req.files.image;

    const result = await cloudinary.uploader.upload(image.tempFilePath, {
      folder: "BusImage",
    });

    data.image = {
      public_Id: result.public_id,
      url: result.secure_url,
    };

    const saveImage = await BusImageModel.create(data);

    if (!saveImage) {
      res
        .status(400)
        .json({ status: false, message: "Failed to upload image" });
    }
    res.status(201).json({
      status: true,
      message: "Image uploaded successfully",
      data: saveImage,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.updateImages = async (req, res) => {
  try {
    const data = req.body;
    const busImageId = req.params.busImageId;
    const { busNumber } = data;

    const check = await BusImageModel.findById(busImageId);
    if (!check) {
      return res
        .status(404)
        .json({ status: false, message: "Not found doccument to update" });
    }

    if (req.files && req.files.image) {
      let image = req.files.image;
      if (check.image.public_Id) {
        const previous = await cloudinary.uploader.destroy(
          check.image.public_Id
        );
      }
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "BusImage",
      });

      data.image = {
        public_Id: result.public_id,
        url: result.secure_url,
      };
    }

    const updateImage = await BusImageModel.findByIdAndUpdate(
      busImageId,
      { ...data },
      { new: true }
    );

    if (!updateImage) {
      res
        .status(400)
        .json({ status: false, message: "Failed to update image" });
    }

    res.status(200).json({
      status: true,
      message: "Image updated successfully",
      data: updateImage,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getAllImages = async (req, res) => {
  try {
    const filter = req.query;

    const images = await BusImageModel.find({ ...filter });

    if (!images || images.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No bus images found" });
    }

    res.status(200).json({
      status: true,
      message: "Bus images retrieved successfully",
      data: images,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const busImageId = req.params.busImageId;

    const delImage = await BusImageModel.findByIdAndDelete(busImageId);

    if (!delImage) {
      return res
        .status(404)
        .json({ status: false, message: "Bus image not found" });
    }
    await cloudinary.uploader.destroy(delImage.image.public_Id);

    res.status(200).json({
      status: true,
      message: "Bus image deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
