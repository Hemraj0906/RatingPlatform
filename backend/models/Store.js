const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  value: {
    type: Number,
    required: false,
    default: 0,
  },
});

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  ratings: [ratingSchema],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
