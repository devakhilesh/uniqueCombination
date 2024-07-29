const { isValidObjectId } = require("mongoose");
const busModel = require("../models/busModel");
const busBlogModel = require("../models/busBlogModel");


exports.createBus = async (req, res) => {
  try {
    const data = req.body;

    const { busName, busNumber, busImage, busStopList } = data;

    const vaildfield = ["busName", "busNumber", "busImage", "busStopList"];

    const dataFields = Object.keys(data);

    // Check for invalid fields
    const invalidFields = dataFields.filter(
      (field) => !vaildfield.includes(field)
    );
    if (invalidFields.length > 0) {
      return res.status(400).json({
        status: false,
        message: `Invalid fields provided: ${invalidFields.join(
          ", "
        )}. Only the following fields are allowed: ${vaildfield.join(", ")}`,
      });
    }

    for (let field of vaildfield) {
      if (!data.hasOwnProperty(field)) {
        return res
          .status(400)
          .json({ status: false, message: `${field} is required` });
      }
    }

    if (
      !busStopList ||
      !Array.isArray(busStopList) ||
      busStopList.length === 0
    ) {
      return res
        .status(400)
        .json({
          status: false,
          message: "busStopList should not be empty and must be an array",
        });
    }

    if (busName == "" || busName !== "string") {
      return res
        .status(400)
        .json({ status: false, message: "Invalid busName" });
    }
    if (busNumber == "" || busNumber !== "string") {
      return res
        .status(400)
        .json({ status: false, message: "Invalid busNumber" });
    }

const check = await busModel.findOne({busNumber: busNumber});
if (check){
    return res
       .status(400)
       .json({ status: false, message: "Bus number already exists" });
}

    if (busImage == "" || busImage !== "string") {
      return res
        .status(400)
        .json({ status: false, message: "Invalid busImage" });
    }

    const saveBusData = await busModel.create(data);
    if (!saveBusData) {
      return res
        .status(400)
        .json({ status: false, message: "Failed to save bus data" });
    }

    res
      .status(200)
      .json({
        status: true,
        message: "Bus data saved successfully",
        data: saveBusData,
      });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.updateBus = async (req, res) => {
  try {
    const busId = req.params.busId;
    const data = req.body;

    if (!busId || !isValidObjectId(busId)) {
      return res.status(400).json({ status: false, message: "Invalid busId" });
    }

    const { busName, busNumber, busImage, busStopList } = data;

    const vaildfield = ["busName", "busNumber", "busImage", "busStopList"];

    const dataFields = Object.keys(data);

    // Check for invalid fields
    const invalidFields = dataFields.filter(
      (field) => !vaildfield.includes(field)
    );
    if (invalidFields.length > 0) {
      return res.status(400).json({
        status: false,
        message: `Invalid fields provided: ${invalidFields.join(
          ", "
        )}. Only the following fields are allowed: ${vaildfield.join(", ")}`,
      });
    }

    if (busStopList) {
      if (!Array.isArray(busStopList) || busStopList.length === 0) {
        return res
          .status(400)
          .json({
            status: false,
            message: "busStopList should not be empty and must be an array",
          });
      }
    }

    if (busName) {
      if (busName == "" || busName !== "string") {
        return res
          .status(400)
          .json({ status: false, message: "Invalid busName" });
      }
    }
    if (busNumber) {
      if (busNumber == "" || busNumber !== "string") {
        return res
          .status(400)
          .json({ status: false, message: "Invalid busNumber" });
      }
    }

    if (busImage) {
      if (busImage == "" || busImage !== "string") {
        return res
          .status(400)
          .json({ status: false, message: "Invalid busImage" });
      }
    }

    const updateBusData = await busModel.findByIdAndUpdate(
      busId,
      { ...data },
      { new: true }
    );

    if (!updateBusData) {
      return res
        .status(400)
        .json({ status: false, message: "Failed to update bus data" });
    }

    res
      .status(200)
      .json({
        status: true,
        message: "Bus data updated successfully",
        data: saveBusData,
      });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};



exports.getAllBuses = async (req,res)=>{
    try{
        const buses = await busModel.find();
        if(buses.length==0){
            return res.status(404).json({status: false, message: 'buses data not found'});
        }

        res.status(200).json({status:true , message:"All buses List", data: buses});

    }catch(err){
       res.status(500).json({status: false, message: err.message});
    }
}


exports.getSingleBus = async (req,res)=>{
    try{
        const busId = req.params.busId;
        const buses = await busModel.findById(busId);
        if(!buses){
            return res.status(404).json({status: false, message: 'bus data not found'});
        }

        res.status(200).json({status:true , message:"Single Bus Data", data: buses});

    }catch(err){
       res.status(500).json({status: false, message: err.message});
    }
}

// busId

exports.deleteBus = async (req,res)=>{
    try{
        const busId = req.params.busId;

        const buses = await busModel.findByIdAndDelete(busId);
        if(!buses){
            return res.status(404).json({status: false, message: 'bus data not found to delete'});
        }

        await busBlogModel.deleteMany({busId:busId});

        res.status(200).json({status:true , message:"Bus with associated blog data deleted susscesfuly"});

    }catch(err){
       res.status(500).json({status: false, message: err.message});
    }
}
