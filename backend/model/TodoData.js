const mongoose = require("mongoose");

// Define the schema for TodoData
const todoDataSchema = new mongoose.Schema(
  {
    tododata: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "Pending",
    },
    startTime: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true } // Add timestamps for createdAt and updatedAt
);

// Create the TodoData model
const TodoData = mongoose.model("TodoData", todoDataSchema);

module.exports = TodoData;
