const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  try {
    // Validate input fields
    if (!name || !email || !password || !address) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    // Create a new User instance
    const user = new User({ name, email, password, address, role });
    console.log("user---->", user);

    await user.save();

    res
      .status(201)
      .json({ message: "User registered successfully", data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "MERN-stack-developer" // Use your JWT_SECRET key
      // { expiresIn: "1h" }
    );

    res.json({
      token,
      role: user.role,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

const logoutUser = (req, res) => {
  res.json({ message: "User logged out successfully" });
};

module.exports = { registerUser, loginUser, changePassword, logoutUser };
