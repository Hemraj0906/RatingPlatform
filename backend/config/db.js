const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    //"mongodb://127.0.0.1:27017/ratingapp"
    await mongoose.connect(
      "mongodb+srv://hemrajdeshmukh0906:Hemraj%404937@cluster0.efckvyo.mongodb.net/RatingApp",
      {}
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;



