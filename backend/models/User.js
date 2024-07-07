  const mongoose = require("mongoose");
  const bcrypt = require("bcryptjs");

  const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 60,
        trim:true,
      
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim:true,
        
      },
      password: {
        type: String,
        required: true,
        trim:true,
        minlength: 8,
        maxlength: 16,
        match:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/,
      },
      address: {
        type: String,
        maxlength: 400,
        trim:true,
      },
      role: {
        type: String,
        enum: ["admin", "normal", "storeOwner"],
        default: "normal",
      },
    },
    { timestamps: true }
  );

  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

  module.exports = mongoose.model("User", userSchema);
