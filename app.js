const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const app = express();
const path = require("path");
const fs = require("fs");
app.use(express.json());

app.use(cors());
 
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});



const uniqueCombo = require("./routes/uniqueCombination");
const admin = require("./routing/adminRouting");
const public = require("./routing/publicRouting");
app.get("/", async (req, res) => {
  return res.sendFile(path.join(__dirname, "index.html"));
});

app.use("/", uniqueCombo);

app.use("/", admin);

app.use("/", public);

module.exports = app;
