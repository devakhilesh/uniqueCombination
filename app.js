const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();
const path = require("path");
const fs = require("fs");
app.use(express.json());

app.use(cors());

app.use(fileUpload());

const uniqueCombo = require("./routes/uniqueCombination");
const admin = require("./routing/adminRouting");
app.get("/", async (req, res) => {
  return res.sendFile(path.join(__dirname, "index.html"));
});

app.use("/", uniqueCombo);

app.use("/", admin);

module.exports = app;
