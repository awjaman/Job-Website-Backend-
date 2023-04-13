const mongoose = require("mongoose");
const { Schema } = mongoose;
const AboutSchema = new Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employer",
  },
  websiteLink:{
    type:String
  },
  about:{
      type:String,
  }
})
const About = mongoose.model(
  "about",
  AboutSchema
);
// User.createIndexes();
module.exports = About;
