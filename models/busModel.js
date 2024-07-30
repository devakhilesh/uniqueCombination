const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    busTittle: {
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
busContent:{
  type: String,
  required: true,
 },
 section1:{
  title1:{
    type: String,
    required: true,
  },
  description1:{
    type: String,
    required: true,
  },

subSection1A:{
  title1A:{
    type: String,
    required: true,
  },
  busStarts1A:{
    type: String,
    required: true,
  },
  busEnds1A:{
    type: String,
    required: true,
  },
  firstBus1A:{
    type: String,
    required: true,
  },
  lastBus1A:{
    type: String,
    required: true,
  },
  totalStops1A:{
    type: String,
    required: true,
  },
totalDepartures1A:{
  type: String,
    required: true,
  },
},

subSection1B:{
  title1B:{
    type: String,
    required: true,
  },
  busStarts1B:{
    type: String,
    required: true,
  },
  busEnds1B:{
    type: String,
    required: true,
  },
  firstBus1B:{
    type: String,
    required: true,
  },
  lastBus1B:{
    type: String,
    required: true,
  },
  totalStops1B:{
    type: String,
    required: true,
  },
totalDepartures1B:{
  type: String,
    required: true,
  },
}

},
 
section2:{
  title2:{
    type: String,
    required: true,
  },
  subSection2A:{
    title2A:{
      type: String,
      required: true,
    },
    busListUpRoute:[
      {
        type:String,
        required:true,
    }
    ],
  
  },
  subSection2B:{
    title2B:{
      type: String,
      required: true,
    },
    busListDownRoute:[
      {
        type:String,
        required:true,
    }
    ],
  },
subSection3:{
  title3:{
    type: String,
    required: true,
  },
  description3:{
    type: String,
    required: true,
  }
}
},

section3:{
  title3:{
    type: String,
    required: true,
  },
  faq:[
    {
      que: {
        type: String,
        required: true,
      },
      ans: {
        type: String,
        required: true,
      },
    },
  ],
},

section4:{
  title4:{
    type: String,
    required: true,
  },
  allBusStops:{
    type:String,
    required: true,
  }
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("BusModel", busSchema);
