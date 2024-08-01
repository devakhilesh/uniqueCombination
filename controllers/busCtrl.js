const { isValidObjectId } = require("mongoose");
const busModel = require("../models/busModel");
const busBlogModel = require("../models/busBlogModel");

// old one 
/* 
exports.createBus = async (req, res) => {
  try {
    const data = req.body;

    const requiredFields = [
      "busTittle", "busNumber", "busImage", "busContent",
      "section1", "section2", "section3", "section4"
    ];

    // Required fields
    for (let field of requiredFields) {
      if (!data.hasOwnProperty(field)) {
        return res.status(400).json({ status: false, message: `${field} is required` });
      }
    }

    // String fields
    const stringFields = ["busTittle", "busNumber", "busImage", "busContent"];
    for (let field of stringFields) {
      if (typeof data[field] !== "string" || data[field].trim() === '') {
        return res.status(400).json({ status: false, message: `Invalid ${field}` });
      }
    }

    // Bus number must be unique
    const check = await busModel.findOne({ busNumber: data.busNumber });
    if (check) {
      return res.status(400).json({ status: false, message: "Bus number already exists" });
    }

    // Section1 validation
    if (!data.section1 || typeof data.section1 !== 'object') {
      return res.status(400).json({ status: false, message: "Invalid section1" });
    }

    const section1Fields = ["title1", "description1"];
    const subSection1AFields = ["title1A", "busStarts1A", "busEnds1A", "firstBus1A", "lastBus1A", "totalStops1A", "totalDepartures1A"];
    const subSection1BFields = ["title1B", "busStarts1B", "busEnds1B", "firstBus1B", "lastBus1B", "totalStops1B", "totalDepartures1B"];

    for (let field of section1Fields) {
      if (!data.section1[field] || typeof data.section1[field] !== 'string' || data.section1[field].trim() === '') {
        return res.status(400).json({ status: false, message: `Invalid section1.${field}` });
      }
    }

    for (let field of subSection1AFields) {
      if (!data.section1.subSection1A[field] || typeof data.section1.subSection1A[field] !== 'string' || data.section1.subSection1A[field].trim() === '') {
        return res.status(400).json({ status: false, message: `Invalid section1.subSection1A.${field}` });
      }
    }

    for (let field of subSection1BFields) {
      if (!data.section1.subSection1B[field] || typeof data.section1.subSection1B[field] !== 'string' || data.section1.subSection1B[field].trim() === '') {
        return res.status(400).json({ status: false, message: `Invalid section1.subSection1B.${field}` });
      }
    }

    // Section2 validation
    if (!data.section2 || typeof data.section2 !== 'object') {
      return res.status(400).json({ status: false, message: "Invalid section2" });
    }

    const section2Fields = ["title2"];
    const subSection2AFields = ["title2A"];
    const subSection2BFields = ["title2B"];
    const subSection2CFields = ["title2C", "description2C"];

    for (let field of section2Fields) {
      if (!data.section2[field] || typeof data.section2[field] !== 'string' || data.section2[field].trim() === '') {
        return res.status(400).json({ status: false, message: `Invalid section2.${field}` });
      }
    }

    for (let field of subSection2AFields) {
      if (!data.section2.subSection2A[field] || typeof data.section2.subSection2A[field] !== 'string' || data.section2.subSection2A[field].trim() === '') {
        return res.status(400).json({ status: false, message: `Invalid section2.subSection2A.${field}` });
      }
    }

    if (!Array.isArray(data.section2.subSection2A.busListUpRoute) || data.section2.subSection2A.busListUpRoute.length === 0) {
      return res.status(400).json({ status: false, message: `Invalid section2.subSection2A.busListUpRoute` });
    }

    for (let field of subSection2BFields) {
      if (!data.section2.subSection2B[field] || typeof data.section2.subSection2B[field] !== 'string' || data.section2.subSection2B[field].trim() === '') {
        return res.status(400).json({ status: false, message: `Invalid section2.subSection2B.${field}` });
      }
    }

    if (!Array.isArray(data.section2.subSection2B.busListDownRoute) || data.section2.subSection2B.busListDownRoute.length === 0) {
      return res.status(400).json({ status: false, message: `Invalid section2.subSection2B.busListDownRoute` });
    }

    for (let field of subSection2CFields) {
      if (!data.section2.subSection2C[field] || typeof data.section2.subSection2C[field] !== 'string' || data.section2.subSection2C[field].trim() === '') {
        return res.status(400).json({ status: false, message: `Invalid section2.subSection2C.${field}` });
      }
    }

    // Section3 validation
    if (!data.section3 || typeof data.section3 !== 'object') {
      return res.status(400).json({ status: false, message: "Invalid section3" });
    }

    if (!data.section3.title3 || typeof data.section3.title3 !== 'string' || data.section3.title3.trim() === '') {
      return res.status(400).json({ status: false, message: `Invalid section3.title3` });
    }

    if (!Array.isArray(data.section3.faq) || data.section3.faq.length === 0) {
      return res.status(400).json({ status: false, message: `Invalid section3.faq` });
    }

    for (let faq of data.section3.faq) {
      if (!faq.que || typeof faq.que !== 'string' || faq.que.trim() === '') {
        return res.status(400).json({ status: false, message: `Invalid section3.faq.que` });
      }
      if (!faq.ans || typeof faq.ans !== 'string' || faq.ans.trim() === '') {
        return res.status(400).json({ status: false, message: `Invalid section3.faq.ans` });
      }
    }

    // Section4 validation
    if (!data.section4 || typeof data.section4 !== 'object') {
      return res.status(400).json({ status: false, message: "Invalid section4" });
    }

    if (!data.section4.title4 || typeof data.section4.title4 !== 'string' || data.section4.title4.trim() === '') {
      return res.status(400).json({ status: false, message: `Invalid section4.title4` });
    }

    if (!data.section4.allBusStops || typeof data.section4.allBusStops !== 'string' || data.section4.allBusStops.trim() === '') {
      return res.status(400).json({ status: false, message: `Invalid section4.allBusStops` });
    }

    // Save bus data
    const saveBusData = await busModel.create(data);
    if (!saveBusData) {
      return res.status(400).json({ status: false, message: "Failed to save bus data" });
    }

    res.status(200).json({
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

    if (!busId || !mongoose.Types.ObjectId.isValid(busId)) {
      return res.status(400).json({ status: false, message: "Invalid busId" });
    }

    const requiredFields = [
      "busTittle", "busNumber", "busImage", "busContent",
      "section1", "section2", "section3", "section4"
    ];

    // Top-level fields
    for (let field of requiredFields) {
      if (data.hasOwnProperty(field)) {
        if (typeof data[field] !== "string" || data[field].trim() === '') {
          return res.status(400).json({ status: false, message: `Invalid ${field}` });
        }
      }
    }

    // Section 1 validation
    if (data.section1) {
      const section1Fields = ["title1", "description1"];
      const subSection1AFields = ["title1A", "busStarts1A", "busEnds1A", "firstBus1A", "lastBus1A", "totalStops1A", "totalDepartures1A"];
      const subSection1BFields = ["title1B", "busStarts1B", "busEnds1B", "firstBus1B", "lastBus1B", "totalStops1B", "totalDepartures1B"];

      for (let field of section1Fields) {
        if (data.section1.hasOwnProperty(field) && (typeof data.section1[field] !== 'string' || data.section1[field].trim() === '')) {
          return res.status(400).json({ status: false, message: `Invalid section1.${field}` });
        }
      }

      if (data.section1.subSection1A) {
        for (let field of subSection1AFields) {
          if (data.section1.subSection1A.hasOwnProperty(field) && (typeof data.section1.subSection1A[field] !== 'string' || data.section1.subSection1A[field].trim() === '')) {
            return res.status(400).json({ status: false, message: `Invalid section1.subSection1A.${field}` });
          }
        }
      }

      if (data.section1.subSection1B) {
        for (let field of subSection1BFields) {
          if (data.section1.subSection1B.hasOwnProperty(field) && (typeof data.section1.subSection1B[field] !== 'string' || data.section1.subSection1B[field].trim() === '')) {
            return res.status(400).json({ status: false, message: `Invalid section1.subSection1B.${field}` });
          }
        }
      }
    }

    // Section 2 validation
    if (data.section2) {
      const section2Fields = ["title2"];
      const subSection2AFields = ["title2A"];
      const subSection2BFields = ["title2B"];
      const subSection2CFields = ["title2C", "description2C"];

      for (let field of section2Fields) {
        if (data.section2.hasOwnProperty(field) && (typeof data.section2[field] !== 'string' || data.section2[field].trim() === '')) {
          return res.status(400).json({ status: false, message: `Invalid section2.${field}` });
        }
      }

      if (data.section2.subSection2A) {
        for (let field of subSection2AFields) {
          if (data.section2.subSection2A.hasOwnProperty(field) && (typeof data.section2.subSection2A[field] !== 'string' || data.section2.subSection2A[field].trim() === '')) {
            return res.status(400).json({ status: false, message: `Invalid section2.subSection2A.${field}` });
          }
        }

        if (data.section2.subSection2A.busListUpRoute) {
          if (!Array.isArray(data.section2.subSection2A.busListUpRoute) || data.section2.subSection2A.busListUpRoute.length === 0) {
            return res.status(400).json({ status: false, message: `Invalid section2.subSection2A.busListUpRoute` });
          }
        }
      }

      if (data.section2.subSection2B) {
        for (let field of subSection2BFields) {
          if (data.section2.subSection2B.hasOwnProperty(field) && (typeof data.section2.subSection2B[field] !== 'string' || data.section2.subSection2B[field].trim() === '')) {
            return res.status(400).json({ status: false, message: `Invalid section2.subSection2B.${field}` });
          }
        }

        if (data.section2.subSection2B.busListDownRoute) {
          if (!Array.isArray(data.section2.subSection2B.busListDownRoute) || data.section2.subSection2B.busListDownRoute.length === 0) {
            return res.status(400).json({ status: false, message: `Invalid section2.subSection2B.busListDownRoute` });
          }
        }
      }

      if (data.section2.subSection2C) {
        for (let field of subSection2CFields) {
          if (data.section2.subSection2C.hasOwnProperty(field) && (typeof data.section2.subSection2C[field] !== 'string' || data.section2.subSection2C[field].trim() === '')) {
            return res.status(400).json({ status: false, message: `Invalid section2.subSection2C.${field}` });
          }
        }
      }
    }

    // Section 3 validation
    if (data.section3) {
      if (data.section3.title3 && (typeof data.section3.title3 !== 'string' || data.section3.title3.trim() === '')) {
        return res.status(400).json({ status: false, message: `Invalid section3.title3` });
      }

      if (data.section3.faq) {
        if (!Array.isArray(data.section3.faq) || data.section3.faq.length === 0) {
          return res.status(400).json({ status: false, message: `Invalid section3.faq` });
        }

        for (let faq of data.section3.faq) {
          if (faq.que && (typeof faq.que !== 'string' || faq.que.trim() === '')) {
            return res.status(400).json({ status: false, message: `Invalid section3.faq.que` });
          }
          if (faq.ans && (typeof faq.ans !== 'string' || faq.ans.trim() === '')) {
            return res.status(400).json({ status: false, message: `Invalid section3.faq.ans` });
          }
        }
      }
    }

    // Section 4 validation
    if (data.section4) {
      if (data.section4.title4 && (typeof data.section4.title4 !== 'string' || data.section4.title4.trim() === '')) {
        return res.status(400).json({ status: false, message: `Invalid section4.title4` });
      }

      if (data.section4.allBusStops && (typeof data.section4.allBusStops !== 'string' || data.section4.allBusStops.trim() === '')) {
        return res.status(400).json({ status: false, message: `Invalid section4.allBusStops` });
      }
    }

    const updateBusData = await busModel.findByIdAndUpdate(
      busId,
      { ...data },
      { new: true }
    );

    if (!updateBusData) {
      return res.status(400).json({ status: false, message: "Failed to update bus data" });
    }

    res.status(200).json({
      status: true,
      message: "Bus data updated successfully",
      data: updateBusData,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

 */


// new 




exports.createBus = async (req, res) => {
  try {
    const { busTittle, busNumber, busListUpRoute, busListDownRoute } = req.body;

    if (!busTittle || !busNumber || !busListUpRoute || !busListDownRoute) {
      return res.status(400).json({
        status: false,
        message: "busTittle, busNumber, busListUpRoute, and busListDownRoute are required",
      });
    }

    if (!Array.isArray(busListUpRoute) || !busListUpRoute.every(item => typeof item === 'string')) {
      return res.status(400).json({
        status: false,
        message: "busListUpRoute must be an array of strings",
      });
    }
    if (!Array.isArray(busListDownRoute) || !busListDownRoute.every(item => typeof item === 'string')) {
      return res.status(400).json({
        status: false,
        message: "busListDownRoute must be an array of strings",
      });
    }

    const saveBusData = await busModel.create({
      busTittle,
      busNumber,
      busListUpRoute,
      busListDownRoute,
    });

    if (!saveBusData) {
      return res.status(400).json({ status: false, message: "Failed to save bus data" });
    }

    res.status(200).json({
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

    const { busTittle, busNumber, busListUpRoute, busListDownRoute } = req.body;

    if (!busId || !mongoose.Types.ObjectId.isValid(busId)) {
      return res.status(400).json({ status: false, message: "Invalid busId" });
    }

    const updateData = {};

    if (busTittle) {
      if (typeof busTittle !== 'string') {
        return res.status(400).json({ status: false, message: "busTittle must be a string" });
      }
      updateData.busTittle = busTittle;
    }

    if (busNumber) {
      if (typeof busNumber !== 'string') {
        return res.status(400).json({ status: false, message: "busNumber must be a string" });
      }
      updateData.busNumber = busNumber;
    }

    if (busListUpRoute) {
      if (!Array.isArray(busListUpRoute) || !busListUpRoute.every(item => typeof item === 'string')) {
        return res.status(400).json({
          status: false,
          message: "busListUpRoute must be an array of strings",
        });
      }
      updateData.busListUpRoute = busListUpRoute;
    }

    if (busListDownRoute) {
      if (!Array.isArray(busListDownRoute) || !busListDownRoute.every(item => typeof item === 'string')) {
        return res.status(400).json({
          status: false,
          message: "busListDownRoute must be an array of strings",
        });
      }
      updateData.busListDownRoute = busListDownRoute;
    }

    const updateBusData = await busModel.findByIdAndUpdate(
      busId,
      { ...updateData },
      { new: true }
    );

    if (!updateBusData) {
      return res.status(400).json({ status: false, message: "Failed to update bus data" });
    }

    res.status(200).json({
      status: true,
      message: "Bus data updated successfully",
      data: updateBusData,
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



// this is called computer 
