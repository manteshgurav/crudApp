const express = require("express");
const router = express.Router();
const MaterialOut = require("../models/MaterialOut");

// GET all material-in entries
router.get("/", async (req, res) => {
  try {
    const materials = await MaterialOut.find();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST new material-in entry
router.post("/", async (req, res) => {
  try {
    const materials = req.body; // Expecting an array of objects

    if (!Array.isArray(materials) || materials.length === 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const savedMaterials = await MaterialOut.insertMany(materials);
    res.status(201).json(savedMaterials);
  } catch (error) {
    console.error("Error saving materials:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET specific material-in entry by ID
router.get("/:id", async (req, res) => {
  try {
    const material = await MaterialOut.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT (Update) material-in entry
router.put("/:id", async (req, res) => {
  try {
    const updatedMaterial = await MaterialOut.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMaterial) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json(updatedMaterial);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE material-in entry
router.delete("/:id", async (req, res) => {
  try {
    const deletedMaterial = await MaterialOut.findByIdAndDelete(req.params.id);
    if (!deletedMaterial) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
