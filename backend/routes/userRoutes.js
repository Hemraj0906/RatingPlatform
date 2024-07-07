const express = require("express");
const {
  getUsers,
  getUserDetails,
  deleteUser,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserDetails);
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
