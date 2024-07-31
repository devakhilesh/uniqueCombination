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


const stops = [
  "Babarpur Extension",
  "Mauzpur",
  "Zafarabad School",
  "Eidgah",
  "Police Station Zafarabad",
  "Seelampur",
  "Parsvnath Metro Mall-Seelampur",
  "Seelampur Metro Station",
  "Dharam Pura",
  "Shastri Park",
  "Shri Shyam Girimath Mandir",
  "Shastri Park Metro Depot",
  "Nityanand Marg",
  "Tis Hazari Court",
  "Saint Stephens Hospital",
  "Baraf Khana",
  "Azad Market / DCM",
  "Bara Hindu Rao",
  "Filmistan",
  "Model Basti",
  "Idgah",
  "Guru Govind Singh Crossing",
  "Faiz Road",
  "Prahlad Market",
  "Khalsa College",
  "Regharpura",
  "R.S. Satsang",
  "Rajendra Place",
  "East Patel Nagar",
  "Patel Nagar Metro Station",
  "West Patel Nagar",
  "Shadipur Metro Station",
  "Shadipur Depot"
];
console.log("stops",stops.length);
