const mongoose = require("mongoose");
const { Schema } = mongoose;
const DetailSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },

  profilePic:{
      type:String,
      
  },
  gender: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: Number,
    required: true,
  },
  address: {
    cLocation: {
      type: String,
      required: true,
    },
    sLocation: {
      type: String,
      required: true,
    },
  },
});
const Detail = mongoose.model("pdetail", DetailSchema);
// User.createIndexes();
module.exports = Detail;
