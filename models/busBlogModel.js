const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const busBlog = new mongoose.Schema(
  {
    busId: {
      type: ObjectId,
      ref: "BusModel",
      required: true,
    },

    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },

    blogTitle: {
      type: String,
      required: true,
    },

    blogShortDes: {
      type: String,
      required: true,
    },
    blogLongDes: {
      type: String,
      required: true,
    },
    // blogImg: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BusBlog", busBlog);
