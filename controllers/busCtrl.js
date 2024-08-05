const { isValidObjectId } = require("mongoose");
const busModel = require("../models/busModel");
const busBlogModel = require("../models/busBlogModel");
const mongoose = require("mongoose");
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


// new but old



/* 
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

 */


// new on according to sir provided content 

exports.createBus = async (req, res) => {
  try {
    const data = req.body;

    const requiredFields = [
      "busTittle", "busNumber", "busImage", "busContent",
      "section1", "section2", "section3", "section4",
      "landMark", "freqOfBus", "totalNumOfStops",
      "nearByAttractions", "saftyMeasures", "dailyPassengersTips",
      "specialNotes"
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

    // LandMark validation
    if (!data.landMark || typeof data.landMark !== 'object') {
      return res.status(400).json({ status: false, message: "Invalid landMark" });
    }

    if (!data.landMark.tittle || typeof data.landMark.tittle !== 'string' || data.landMark.tittle.trim() === '') {
      return res.status(400).json({ status: false, message: `Invalid landMark.tittle` });
    }

    if (!data.landMark.description || typeof data.landMark.description !== 'string' || data.landMark.description.trim() === '') {
      return res.status(400).json({ status: false, message: `Invalid landMark.description` });
    }

    // freqOfBus validation
    if (data.freqOfBus) {
      if (!data.freqOfBus.tittle || typeof data.freqOfBus.tittle !== 'string' || data.freqOfBus.tittle.trim() === '') {
        return res.status(400).json({ status: false, message: `Invalid freqOfBus.tittle` });
      }
      if (!data.freqOfBus.description || typeof data.freqOfBus.description !== 'string' || data.freqOfBus.description.trim() === '') {
        return res.status(400).json({ status: false, message: `Invalid freqOfBus.description` });
      }
    }

    // totalNumOfStops validation
    if (!data.totalNumOfStops || typeof data.totalNumOfStops !== 'object') {
      return res.status(400).json({ status: false, message: "Invalid totalNumOfStops" });
    }

    if (!data.totalNumOfStops.tittle || typeof data.totalNumOfStops.tittle !== 'string' || data.totalNumOfStops.tittle.trim() === '') {
      return res.status(400).json({ status: false, message: `Invalid totalNumOfStops.tittle` });
    }

    if (!data.totalNumOfStops.description || typeof data.totalNumOfStops.description !== 'string' || data.totalNumOfStops.description.trim() === '') {
      return res.status(400).json({ status: false, message: `Invalid totalNumOfStops.description` });
    }

    // nearByAttractions validation
    if (!data.nearByAttractions || typeof data.nearByAttractions !== 'object') {
      return res.status(400).json({ status: false, message: "Invalid nearByAttractions" });
    }

    if (!data.nearByAttractions.tittle || typeof data.nearByAttractions.tittle !== 'string' || data.nearByAttractions.tittle.trim() === '') {
      return res.status(400).json({ status: false, message: `Invalid nearByAttractions.tittle` });
    }

    if (!data.nearByAttractions.description || typeof data.nearByAttractions.description !== 'string' || data.nearByAttractions.description.trim() === '') {
      return res.status(400).json({ status: false, message: `Invalid nearByAttractions.description` });
    }

    // saftyMeasures validation
    if (!data.saftyMeasures || typeof data.saftyMeasures !== 'object') {
      return res.status(400).json({ status: false, message: "Invalid saftyMeasures" });
    }

    if (!data.saftyMeasures.tittle || typeof data.saftyMeasures.tittle !== 'string' || data.saftyMeasures.tittle.trim() === '') {
      return res.status(400).json({ status: false, message: `Invalid saftyMeasures.tittle` });
    }

    if (!data.saftyMeasures.description || typeof data.saftyMeasures.description !== 'string' || data.saftyMeasures.description.trim() === '') {
      return res.status(400).json({ status: false, message: `Invalid saftyMeasures.description` });
    }

    // dailyPassengersTips validation
    if (!data.dailyPassengersTips || typeof data.dailyPassengersTips !== 'object') {
      return res.status(400).json({ status: false, message: "Invalid dailyPassengersTips" });
    }

    if (!data.dailyPassengersTips.tittle || typeof data.dailyPassengersTips.tittle !== 'string' || data.dailyPassengersTips.tittle.trim() === '') {
      return res.status(400).json({ status: false, message: `Invalid dailyPassengersTips.tittle` });
    }

    if (!data.dailyPassengersTips.description || typeof data.dailyPassengersTips.description !== 'string' || data.dailyPassengersTips.description.trim() === '') {
      return res.status(400).json({ status: false, message: `Invalid dailyPassengersTips.description` });
    }

    // specialNotes validation
    if (!data.specialNotes || typeof data.specialNotes !== 'object') {
      return res.status(400).json({ status: false, message: "Invalid specialNotes" });
    }

    if (!data.specialNotes.tittle || typeof data.specialNotes.tittle !== 'string' || data.specialNotes.tittle.trim() === '') {
      return res.status(400).json({ status: false, message: `Invalid specialNotes.tittle` });
    }

    if (!data.specialNotes.description || typeof data.specialNotes.description !== 'string' || data.specialNotes.description.trim() === '') {
      return res.status(400).json({ status: false, message: `Invalid specialNotes.description` });
    }

    const newBus = await busModel.create(data);
    return res.status(201).json({ status: true, message: "Bus created successfully", data: newBus });

  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};


exports.updateBus = async (req, res) => {
  try {
    const busId = req.params.busId;
    const data = req.body;

    if (!busId || !mongoose.Types.ObjectId.isValid(busId)) {
      return res.status(400).json({ status: false, message: "Invalid busId" });
    }

    // const requiredFields = [
    //   "busTittle", "busNumber", "busImage", "busContent",
    //   "section1", "section2", "section3", "section4",
    //   "landMark", "freqOfBus", "totalNumOfStops",
    //   "nearByAttractions", "saftyMeasures", "dailyPassengersTips",
    //   "specialNotes"
    // ];

    // // Top-level fields
    // for (let field of requiredFields) {
    //   if (data.hasOwnProperty(field)) {
    //     if (typeof data[field] !== "string" || data[field].trim() === '') {
    //       return res.status(400).json({ status: false, message: `Invalid ${field}` });
    //     }
    //   }
    // }

    // Section 1 
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

    // Additional sections validation
    const additionalSections = [
      { section: 'landMark', fields: ['tittle', 'description'] },
      { section: 'freqOfBus', fields: ['tittle', 'description'] },
      { section: 'totalNumOfStops', fields: ['tittle', 'description'] },
      { section: 'nearByAttractions', fields: ['tittle', 'description'] },
      { section: 'saftyMeasures', fields: ['tittle', 'description'] },
      { section: 'dailyPassengersTips', fields: ['tittle', 'description'] },
      { section: 'specialNotes', fields: ['tittle', 'description'] },
    ];

    for (let section of additionalSections) {
      if (data[section.section]) {
        for (let field of section.fields) {
          if (data[section.section].hasOwnProperty(field) && (typeof data[section.section][field] !== 'string' || data[section.section][field].trim() === '')) {
            return res.status(400).json({ status: false, message: `Invalid ${section.section}.${field}` });
          }
        }
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

        res.status(200).json({status:true , message:"Bus with associated data deleted susscesfuly"});

    }catch(err){
       res.status(500).json({status: false, message: err.message});
    }
}



// this is called computer 
