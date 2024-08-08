const mongoose = require("mongoose");

const BusImageSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  image: {
    public_Id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
},
{timestamps: true});


module.exports = mongoose.model("BusImage", BusImageSchema);