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

function removeQuotes(str) {
    return str.replace(/[“”"']/g, '');
  }
  

exports.convert = async (req, res) => {
  try {
    if (!req.files || !req.files.excelFile) {
      return res.status(400).json({ status: false, message: 'No file uploaded' });
    }

    const file = req.files.excelFile;
    const ext = path.extname(file.name).toLowerCase();
    const filePath = path.join(uploadDir, file.name);

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

    fs.unlinkSync(filePath);

    const formattedData = jsonData.map((bus) => ({
      busTittle: bus.busTittle,
      busNumber: bus.busNumber,
      busImage: bus.busImage,
      busContent: bus.busContent,
      section1: {
        title1: bus['section1.title1'],
        description1: bus['section1.description1'],
        subSection1A: {
          title1A: bus['section1.subSection1A.title1A'],
          busStarts1A: bus['section1.subSection1A.busStarts1A'],
          busEnds1A: bus['section1.subSection1A.busEnds1A'],
          firstBus1A:removeQuotes(bus['section1.subSection1A.firstBus1A']) ,
          lastBus1A: removeQuotes(bus['section1.subSection1A.lastBus1A']),
          totalStops1A: bus['section1.subSection1A.totalStops1A'],
          totalDepartures1A: bus['section1.subSection1A.totalDepartures1A'],
        },
        subSection1B: {
          title1B: bus['section1.subSection1B.title1B'],
          busStarts1B: bus['section1.subSection1B.busStarts1B'],
          busEnds1B: bus['section1.subSection1B.busEnds1B'],
          firstBus1B: removeQuotes(bus['section1.subSection1B.firstBus1B']),
          lastBus1B: removeQuotes(bus['section1.subSection1B.lastBus1B']),
          totalStops1B: bus['section1.subSection1B.totalStops1B'],
          totalDepartures1B: bus['section1.subSection1B.totalDepartures1B'],
        },
      },
      section2: {
        title2: bus['section2.title2'],
        subSection2A: {
          title2A: bus['section2.subSection2A.title2A'],
          busListUpRoute: bus['section2.subSection2A.busListUpRoute'] ? bus['section2.subSection2A.busListUpRoute'].split(',').map(stop => stop.trim()) : [],
        },
        subSection2B: {
          title2B: bus['section2.subSection2B.title2B'],
          busListDownRoute: bus['section2.subSection2B.busListDownRoute'] ? bus['section2.subSection2B.busListDownRoute'].split(',').map(stop => stop.trim()) : [],
        },
        subSection2C: {
            title2C: bus['section2.subSection2C.title2C'],
            description2C: bus['section2.subSection2C.description2C'],
          },
      },
      section3: {
        title3: bus['section3.title3'],
        faq: bus['section3.faq'] ? bus['section3.faq'].split(';').map(pair => {
          const [que, ans] = pair.split(':').map(item => item.trim());
          return { que, ans };
        }) : [],
      },
      section4: {
        title4: bus['section4.title4'],
        allBusStops: bus['section4.allBusStops'],
      }
    }));

    // Save to MongoDB
    const insertedData = await busModel.insertMany(formattedData);

    res.status(200).json({ status: true, message: 'Data uploaded and saved successfully', data: formattedData,db:insertedData  });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
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