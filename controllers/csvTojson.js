const csvtojson = require('csvtojson');
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const busModel = require('../models/busModel');
const busBlogModel = require('../models/busBlogModel');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

exports.convert = async (req, res) => {
    try {
        if (!req.files || !req.files.excelFile) {
          return res.status(400).json({ status: false, message: 'No file uploaded' });
        }
    
        const file = req.files.excelFile;
        const ext = path.extname(file.name).toLowerCase();
        const filePath = path.join(uploadDir, file.name);
    
        // Move the file to the uploads directory
        await file.mv(filePath);
    
        let jsonData;
    
        if (ext === '.csv') {
          jsonData = await csvtojson().fromFile(filePath);
        } else if (ext === '.xlsx' || ext === '.xls') {
          const workbook = xlsx.readFile(filePath);
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          jsonData = xlsx.utils.sheet_to_json(worksheet);
        } else {
          fs.unlinkSync(filePath);
          return res.status(400).json({ status: false, message: 'Unsupported file type' });
        }
    
        // Delete the uploaded file after processing
        fs.unlinkSync(filePath);
    
        // Transform busStopList from string to array
        const formattedData = jsonData.map((bus) => ({
          ...bus,
          busStopList: bus.busStopList ? bus.busStopList.split(',').map(stop => stop.trim()) : []
        }));
    
        // Save to MongoDB
    let insertedData =  await busModel.insertMany(formattedData);
    
        res.status(200).json({ status: true, message: 'Data uploaded and saved successfully', data: formattedData ,db:insertedData});
      } catch (err) {
        res.status(500).json({ status: false, message: err.message });
      }
};



exports.busBlog = async (req, res)=>{
    try {
        const { busId } = req.params;
    
        // Validate busId
        if (!mongoose.Types.ObjectId.isValid(busId)) {
          return res.status(400).json({ status: false, message: 'Invalid busId' });
        }
    
        const bus = await busModel.findById(busId);
        if (!bus) {
          return res.status(404).json({ status: false, message: 'Bus not found' });
        }
    
        if (!req.files || !req.files.excelFile) {
          return res.status(400).json({ status: false, message: 'No file uploaded' });
        }
    
        const file = req.files.excelFile;
        const ext = path.extname(file.name).toLowerCase();
        const filePath = path.join(uploadDir, file.name);
    
        // Move the file to the uploads directory
        await file.mv(filePath);
    
        if (ext !== '.xlsx' && ext !== '.xls') {
          fs.unlinkSync(filePath);
          return res.status(400).json({ status: false, message: 'Unsupported file type' });
        }
    
        // Read and parse the Excel file
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);
    
        fs.unlinkSync(filePath); // Delete the uploaded file after processing
    
        // Process each row in the Excel file
        for (const row of jsonData) {
          const { from, to, blogTitle, blogShortDes, blogLongDes } = row;
    
          // Validate required fields
          if (!from || !to || !blogTitle || !blogShortDes || !blogLongDes) {
            return res.status(400).json({ status: false, message: 'Missing required fields in one or more rows' });
          }
    
          // Create and save the new bus blog
          const newBusBlog ={
            busId: busId,
            from: from,
            to: to,
            blogTitle: blogTitle,
            blogShortDes: blogShortDes,
            blogLongDes: blogLongDes,
          };
    
          await busBlogModel.create(newBusBlog);
        }
    
const getAllBlogListofBus = await busBlogModel.find({busId:busId});


        res.status(201).json({ status: true, message: 'Bus blogs saved successfully', data:getAllBlogListofBus, json:jsonData });
      } catch (err) {
        res.status(500).json({ status: false, message: err.message });
      }
}