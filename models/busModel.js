const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    busName: {
      type: String,
      required: true,
    },
    busNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    busImage: {
      type: String,
      required: true,
    },

    busStopList:[
        {
            type:String,
            required:true,
        }
    ]

  },
  { timestamps: true }
);

module.exports = mongoose.model("BusModel", busSchema);
