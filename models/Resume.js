const mongoose = require("mongoose");
const { stringify } = require("querystring");
const { Schema } = mongoose;
const ResumeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  education: {

    type:Array,
      items:{
      college:String,
      course: String,
      status: String,
      startDate: String,
      endDate: String,
      performanceScale: String,
      performance: String,
      }
    
  },
  job:{
    type:Array,
    items:{
    profileName:String,
    companyName:String,
    status:String,
    startDate:String,
    endDate:String,
    Description:String
    }
  },
  // academicProject: String,
  internship:{
    type:Array,
    items:{
        profileName:String,
        companyName:String,
        status:String,
        startDate:String,
        endDate:String,
        description:String
    }
  },
  responsibilties:
  {
    type:Array,
    items:{
      type:String
    }
  },
  training:{
    type:Array,
    items:{
     courseName:String,
     platformName:String,
     status:String,
     startDate:String,
     endDate:String
    }
  },

  portfolio:{
    type:Array,
    items:{
      type:String,
    }
  } ,

  skills: {
    type: Array,
    items: {
      String,
    },
  },
  additionalDetail:{
    type:Array,
    items:{
     type:String
    }
  
  }
  // coverLetter: String,
  // yourAvailability: String,
});
const Resume = mongoose.model("resume", ResumeSchema);
// User.createIndexes();
module.exports = Resume;
