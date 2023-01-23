const mongoose = require("mongoose");
const { Schema } = mongoose;
const InternshipSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  typeOfInternship: {
    type: String,
    required: true,
  },
  interest: {
    interest1: {
      type: String,
    },

    interest2: {
      type: String,
    },

    interest3: {
      type: String,
    },
  },
});
const Internship = mongoose.model("internships", InternshipSchema);
// User.createIndexes();
module.exports = Internship;
