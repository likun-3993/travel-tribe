const mongoose = require("mongoose");

const tripData = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  seats: {
    type: Number,
    default: 0,
  },
  vacancy: {
    type: Number,
    default: 0,
  },
  cost: {
    type: Number,
    default: 0,
  },
  // time: {
  //   type: Date,
  //   default: new Date(),
  // },
  // date: {
  //   type: Date,
  //   default: new Date(),
  // },
});

module.exports = mongoose.model("Trip", tripData);
