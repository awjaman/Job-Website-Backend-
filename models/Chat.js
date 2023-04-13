const mongoose = require("mongoose");
const { Schema } = mongoose;
const ChatSchema = new Schema({
  
    message: {
      text: { type: String, required: true },
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// creating model

const Chat = mongoose.model("chat", ChatSchema);
// User.createIndexes();
module.exports = Chat;
