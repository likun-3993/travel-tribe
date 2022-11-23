const mongoose = require("mongoose");

const trekData = new mongoose.Schema({
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
  images: {
    type: Number,
    default: 0,
  },
  Stime: {
    type: Date,
    default: new Date(),
  },
  Ftime: {
    type: Date,
    default: new Date(),
  },
  date: {
    type: Date,
    default: new Date(),
  },
  meeting_place: {
    type: String,
  },
});

module.exports = mongoose.model("Treks", trekData);
