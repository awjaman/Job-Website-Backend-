const mongoose = require("mongoose");
const { Schema } = mongoose;
const EmployerSchema = new Schema({
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

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: Number,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

// creating model

const Employer = mongoose.model("employer", EmployerSchema);
// User.createIndexes();
module.exports = Employer;
