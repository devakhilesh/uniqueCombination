const { isValidObjectId } = require("mongoose");
const busModel = require("../models/busModel");
const busFromToModel = require("../models/busFromAndToModel");

exports.createBusFromTo = async (req, res) => {
  try {
    const busId = req.params.busId;

    const data = req.body;

    if (!busId || !isValidObjectId(busId)) {
      return res.status(400).json({ status: false, message: "Invalid busId" });
    }

const checkBus = await busModel.findById(busId);
if(!checkBus){
  return res.status(404).json({ status: false, message: "Bus not found" });
}


    const {from, to} = data;

    const vaildfield = [
      "from",
      "to"
    ];

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

    if (from.trim() === '' ||typeof from !== "string") {
      return res.status(400).json({
        status: false,
        message: "from should not be empty and must be a string",
      });
    }

    if (to.trim() === '' ||typeof to !== "string") {
        return res.status(400).json({
          status: false,
          message: "from should not be empty and must be a string",
        });
      }

const checkBlogExists = await busFromToModel.findOne({busId:busId, from:from, to:to});
if (checkBlogExists){
    return res.status(400).json({status: false, message: `Blog already exists for this particular bus for this from  ${from} to ${to} route `});
}


    data.busId = busId;

    const saveBusBlogData = await busModel.create(data);
    if (!saveBusBlogData) {
      return res
        .status(400)
        .json({ status: false, message: "Failed to save bus Blog data" });
    }

    res.status(200).json({
      status: true,
      message: "Bus data saved successfully",
      data: saveBusBlogData,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};


exports.updateBusFromTo = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    const data = req.body;

    if (!blogId || !isValidObjectId(blogId)) {
      return res.status(400).json({ status: false, message: "Invalid blogId" });
    }

const checkBlog = await busModel.findById(blogId);
if(!checkBlog){
  return res.status(404).json({ status: false, message: "Bus blog not found" });
}

    const {from, to} = data;

    const vaildfield = [
      "from",
      "to"
    ];

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


 if(from){
    if (from.trim() === '' ||typeof from !== "string") {
      return res.status(400).json({
        status: false,
        message: "{from} should not be empty and must be a string",
      });
    }
}

if(to){
    if (to.trim() === '' ||typeof to !== "string") {
        return res.status(400).json({
          status: false,
          message: "{to} should not be empty and must be a string",
        });
      }

    }


const checkBlogExists = await busFromToModel.findOne({busId:checkBlog.busId, from:from, to:to});
if (checkBlogExists){

  await findByIdAndDelete(checkBlogExists._id);
  data.busId = checkBlog._id;
const updateData = await busFromToModel.create(data)
return res.status(200).json({status: true, message:"blog updated successfully", data: updateData})

}
    const updateBusBlogData = await busModel.findByIdAndUpdate(blogId, {...data}, {new: true});
    if (!updateBusBlogData) {
      return res
        .status(400)
        .json({ status: false, message: "Failed to update bus Blog data" });
    }

    res.status(200).json({
      status: true,
      message: "Bus data update successfully",
      data: updateBusBlogData,
    });

  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};


// from :A to B => 10 
exports.getAllBusesListAccDestination = async (req, res)=>{
  try{

const from = req.query.from
const to = req.query.to

const allBussesList = await busFromToModel.find({ from: from, to: to}).populate("busId")
if(allBussesList.length==0){
  return res.status(404).json({ status: false, message: "No bus found for this route" });
}
// need to test 

let busDataList = []

for(let i=0; i<allBussesList.length; i++){

const busData ={
busName : allBussesList[i].busId.busName,
busNumber : allBussesList[i].busId.busNumber,
busImage: allBussesList[i].busId.busImage,
  }

  busDataList.push(busData);

}

res.status(200).json({status: true, message: "Bus data fetched successfully for this destination", data: busDataList})

  }catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
}

// tittle short description long description bus image aur all stop list from to 
exports.getparticularBusFromTo = async (req, res)=>{
  try{

const busId = req.params.busId

const from = req.query.from
const to = req.query.to

if (!busId || !isValidObjectId(busId)) {
  return res.status(400).json({ status: false, message: "Invalid busId" });
}


const busBlog = await busFromToModel.findOne({busId:busId ,from: from, to: to}).populate("busId")
if(!busBlog){
  return res.status(404).json({ status: false, message: "No bus blog found for this route" });
}

const busBlogData = {
busName : busBlog.busId.busName,
busNumber : busBlog.busId.busNumber,
busImage: busBlog.busId.busImage,
busStopList: busBlog.busId.busStopList,
from: busBlog.from,
to: busBlog.to,
blogTitle: busBlog.blogTitle,
blogShortDes: busBlog.blogShortDes,
blogLongDes: busBlog.blogLongDes,
  }

res.status(200).json({status: true, message: "Bus blog data fetched successfully for this destination", data: busBlogData})

  }catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
}

exports.getAllBlogListOfParticularBus = async (req, res)=>{
  try{

const busId = req.params.busId
if (!busId || !isValidObjectId(busId)) {
  return res.status(400).json({ status: false, message: "Invalid busId" });
}

const check = await busModel.findById(busId)
if(!check){
  return res.status(404).json({ status: false, message: "No bus found" });
}
const allBusBlogList = await busFromToModel.find({ busId }).select('-busId');

if(allBusBlogList.length == 0){
  return res.status(404).json({ status: false, message: "No blog found for this bus" });
}


let busData = {
  busName : check.busName,
  busNumber : check.busNumber,
  // busImage: check.busImage,
  // busStopList: check.busStopList,
  blogList: allBusBlogList,
}


res.status(200).json({status:true , message:`all blog list of this bus no. ${check.busNumber} and name ${check.busNumber} `,data:busData })

  }catch(err){
    res.status(500).json({ status: false, message: err.message });
  }
}




exports.deleteParticularBlog = async (req, res)=>{
  try{
    const blogId = req.params.blogId;

   
    if (!blogId || !isValidObjectId(blogId)) {
      return res.status(400).json({ status: false, message: "Invalid blogId" });
    }

    let deleteBlog = await busFromToModel.findByIdAndDelete(blogId);
if(!deleteBlog){
  return res.status(404).json({ status: false, message: "Blog not found" });
}

res.status(200).json({ status: true, message:"blogDeleted Successfully" });

  }catch(err){
    res.status(500).json({ status: false, message: err.message });
  }
}