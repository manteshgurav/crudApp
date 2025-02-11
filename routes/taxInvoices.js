const express = require("express");
const router = express.Router();
const TaxInvoice = require("../models/TaxInvoice");

// GET all tax invoices
router.get("/", async (req, res) => {
  try {
    const taxInvoices = await TaxInvoice.find();
    res.json(taxInvoices);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST new tax invoice
router.post("/", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res
        .status(400)
        .json({ message: "Invalid format, expected an array." });
    }

    const savedInvoices = await TaxInvoice.insertMany(req.body);
    res.status(201).json(savedInvoices);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE tax invoice by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedInvoice = await TaxInvoice.findByIdAndDelete(req.params.id);
    if (!deletedInvoice) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE tax invoice by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedInvoice = await TaxInvoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedInvoice) return res.status(404).json({ message: "Not found" });
    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
