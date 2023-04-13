const mongoose = require("mongoose");
const { Schema } = mongoose;
const JobSchema = new Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "internshipdetail",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  assignment:{
    type:String,
  
  },
  status:{
    type:String,
     
  }
});

// creating model

const Job = mongoose.model("job", JobSchema);
// User.createIndexes();
module.exports = Job;
