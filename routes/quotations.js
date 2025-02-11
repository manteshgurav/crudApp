const express = require("express");
const router = express.Router();
const Quotation = require("../models/Quotation");

// GET all quotations
router.get("/", async (req, res) => {
  try {
    const quotations = await Quotation.find();
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST new quotation
router.post("/", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res
        .status(400)
        .json({ message: "Invalid format, expected an array." });
    }

    const savedQuotations = await Quotation.insertMany(req.body);
    res.status(201).json(savedQuotations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE quotation by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedQuotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!deletedQuotation)
      return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE quotation by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedQuotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedQuotation)
      return res.status(404).json({ message: "Not found" });
    res.json(updatedQuotation);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
