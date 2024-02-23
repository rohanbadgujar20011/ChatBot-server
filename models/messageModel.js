const mongoose = require("mongoose");
const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, require: true },
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Message", MessageSchema);
