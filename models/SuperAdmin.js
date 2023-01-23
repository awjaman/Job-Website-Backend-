const mongoose = require("mongoose");
const { Schema } = mongoose;
const SuperAdminSchema = new Schema({
   email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
   });

// creating model

const SuperAdmin = mongoose.model("superadmin", SuperAdminSchema);
// User.createIndexes();
module.exports = SuperAdmin;
