

const express = require("express");
const {
  addStore,
  getStores,
  rateStore,
  deleteRating,
  getStoreDetails,
  getUserStores,
  deleteStore,
  getStoreRatings,
} = require("../controllers/storeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, addStore); 
router.get("/", authMiddleware, getStores); 
router.get("/:storeId", authMiddleware, getStoreDetails);
router.get("/user/:userId", authMiddleware, getUserStores);
router.post("/:storeId/rate", authMiddleware, rateStore); 
router.delete("/:storeId/rate", authMiddleware, deleteRating); 
router.delete("/:storeId", authMiddleware, deleteStore);
router.get("/:storeId/ratings", authMiddleware, getStoreRatings);

module.exports = router;
