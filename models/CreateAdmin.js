const mongoose = require("mongoose");
const { Schema } = mongoose;
const CreateAdminSchema = new Schema({
  name: {
    firstName: {
      type: String,
      reuired: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  gender: {
    type: String,
    required: true,
  },
  mobileNumber: {
    dialCode: {
      type: Number,
      required: true,
    },
    phone:{
        type:Number,
        required:true
    }
  },
  typeOfAdmin: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified:{
      type:Boolean,
      required:true,
      default:false
  }
});
const CreateAdmin = mongoose.model("createadmin", CreateAdminSchema);
// User.createIndexes();
module.exports = CreateAdmin;
