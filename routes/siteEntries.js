const express = require("express");
const router = express.Router();
const SiteEntry = require("../models/SiteEntry");

// GET all site entries
router.get("/", async (req, res) => {
  try {
    const siteEntries = await SiteEntry.find();
    res.json(siteEntries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST new site entry
router.post("/", async (req, res) => {
  try {
    const newEntry = new SiteEntry(req.body);
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
