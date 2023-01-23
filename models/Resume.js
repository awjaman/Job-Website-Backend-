const mongoose = require("mongoose");
const { stringify } = require("querystring");
const { Schema } = mongoose;
const ResumeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  education: {
    graduation: String,
    senior12th: String,
    secondary10th: String,
    postgraduation: String,
    diploma: String,
    phd: String,
  },
  job: String,
  academicProject: String,
  portfolio: String,
  skills: {
    type:Array,
    items:{
    String
    }
  },
  coverLetter: String,
  yourAvailability: String,
  
});
const Resume = mongoose.model("resume", ResumeSchema);
// User.createIndexes();
module.exports = Resume;
