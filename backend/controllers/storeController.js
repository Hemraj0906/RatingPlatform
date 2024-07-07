const Store = require("../models/Store");
const User = require("../models/User");
const mongoose = require("mongoose");

const addStore = async (req, res) => {
  const { name, email, address } = req.body;
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user.id;

    
    const ratings = [
      {
        value: 0,
        userId: userId, 
      },
    ];

    
    const store = new Store({ name, email, address, userId, ratings });

    
    await store.save();

    
    res.status(201).json({ message: "Store added successfully", data: store });
  } catch (error) {
    console.error("Error adding store:", error);
    res.status(500).json({ error: error.message });
  }
};

const getStores = async (req, res) => {
  try {
    console.log("Request User:", req.user);
    const stores = await Store.find();
    res.status(200).json(stores);
  } catch (error) {
    console.error("Error fetching stores:", error.stack);
    res.status(500).json({ error: error.message });
  }
};

const rateStore = async (req, res) => {
  const { storeId } = req.params;
  const { rating } = req.body;
  const userId = req.user.id;

  try {
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const existingRating = store.ratings.find(
      (r) => r.userId.toString() === userId
    );

    if (existingRating) {
      existingRating.value = rating;
    } else {
      store.ratings.push({ userId, value: rating });
    }

    store.rating =
      store.ratings.reduce((acc, r) => acc + r.value, 0) / store.ratings.length;

    await store.save();
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteRating = async (req, res) => {
  const { storeId } = req.params;
  const userId = req.user.id;

  try {
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const ratingIndex = store.ratings.findIndex(
      (r) => r.userId.toString() === userId.toString()
    );
    if (ratingIndex === -1) {
      return res.status(404).json({ message: "Rating not found" });
    }

    store.ratings.splice(ratingIndex, 1);

    // Recalculate the average rating
    const totalRatings = store.ratings.reduce((sum, r) => sum + r.value, 0);
    store.rating =
      store.ratings.length > 0 ? totalRatings / store.ratings.length : 0;

    await store.save();

    res
      .status(200)
      .json({ message: "Rating deleted successfully", data: store });
  } catch (error) {
    console.error("Error deleting rating:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getStoreDetails = async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId).populate(
      "ratings.userId",
      "name email"
    );
    if (!store) return res.status(404).json({ message: "Store not found" });

    const totalRatings = store.ratings.reduce(
      (sum, rating) => sum + rating.value,
      0
    );
    const averageRating = store.ratings.length
      ? totalRatings / store.ratings.length
      : 0;

    res.json({ store, averageRating });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

const getUserStores = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
    const stores = await Store.find({ userId });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stores." });
  }
};

const deleteStore = async (req, res) => {
  try {
    await Store.findByIdAndDelete(req.params.storeId);
    res.status(200).json({ message: "Store deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getStoreRatings = async (req, res) => {
  const { storeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    return res.status(400).json({ message: "Invalid store ID" });
  }

  try {
    const store = await Store.findById(storeId).populate({
      path: "ratings.userId",
      select: "name",
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.json(store.ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  addStore,
  getStores,
  rateStore,
  deleteRating,
  getStoreDetails,
  deleteStore,
  getUserStores,
  getStoreRatings,
};
