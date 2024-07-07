const express = require("express");
const {
  registerUser,
  loginUser,
  changePassword,
  logoutUser
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", authMiddleware, changePassword);
router.post("/logout", authMiddleware, logoutUser);

module.exports = router;
