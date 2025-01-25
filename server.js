// Import required libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Set up port and MongoDB connection URI from environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB using Mongoose
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: { w: 1 },
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Define the Mongoose schema for the TaxInvoice model
const taxInvoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, required: true },
  workOrderNo: { type: String, required: true },
  invoiceDate: { type: Date, required: true },
  itemDescription: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  taxRate: { type: Number, required: true },
  invoiceStatus: { type: String, required: true },
  dueDate: { type: Date, required: true },
});

// Define the Mongoose schema for the Quotation model
const quotationSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  unit: { type: Number, required: true },
  rate: { type: Number, required: true },
  total: { type: Number, required: true },
});

// Create a Mongoose model using the defined schema
const Quotation = mongoose.model("Quotation", quotationSchema);

// Create a Mongoose model using the defined schema
const TaxInvoice = mongoose.model("TaxInvoice", taxInvoiceSchema);

// Define the CRUD Routes

// GET route to fetch all quotations
app.get("/quotations", async (req, res) => {
  try {
    const quotations = await Quotation.find();
    if (quotations.length === 0) {
      return res.status(404).json({ message: "No quotations found" });
    }
    res.json(quotations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST route to create a new quotation
app.post("/quotations", async (req, res) => {
  try {
    const { companyName, date, description, unit, rate, total } = req.body;

    if (!companyName || !date || !description || !unit || !rate || !total) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newQuotation = new Quotation({
      companyName: companyName.trim(),
      date: new Date(date),
      description: description.trim(),
      unit,
      rate,
      total,
    });

    const savedQuotation = await newQuotation.save();
    res.status(201).json(savedQuotation);
  } catch (error) {
    console.error("Error details:", error.stack);
    res.status(500).json({
      message: "An unexpected server error occurred",
      error: error.message,
    });
  }
});

// DELETE route to delete a quotation by its ID
app.delete("/quotations/:id", async (req, res) => {
  try {
    const deletedQuotation = await Quotation.findByIdAndDelete(req.params.id);

    if (!deletedQuotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    res.json({ message: "Quotation deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT route to update an existing quotation by its ID
app.put("/quotations/:id", async (req, res) => {
  try {
    const { companyName, date, description, unit, rate, total } = req.body;

    // Validate required fields
    if (!companyName || !date || !description || !unit || !rate || !total) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure unit is a string and trim it
    const sanitizedUnit =
      typeof unit === "string" ? unit.trim() : String(unit).trim();

    // Proceed with updating the quotation
    const updatedQuotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      {
        companyName: companyName.trim(),
        date: new Date(date),
        description: description.trim(),
        unit: sanitizedUnit, // Use the sanitized unit value
        rate,
        total,
      },
      { new: true }
    );

    if (!updatedQuotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    res.json(updatedQuotation);
  } catch (error) {
    console.error("Error details:", error); // Log error details for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET route to fetch all tax invoices
app.get("/taxInvoices", async (req, res) => {
  try {
    const taxInvoices = await TaxInvoice.find();
    if (taxInvoices.length === 0) {
      return res.status(404).json({ message: "No tax invoices found" });
    }
    res.json(taxInvoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST route to create a new tax invoice
app.post("/taxInvoices", async (req, res) => {
  try {
    const {
      invoiceNo,
      workOrderNo,
      invoiceDate,
      itemDescription,
      quantity,
      unitPrice,
      totalPrice,
      taxRate,
      invoiceStatus,
      dueDate,
    } = req.body;

    // Validate required fields
    if (
      !invoiceNo ||
      !workOrderNo ||
      !invoiceDate ||
      !itemDescription ||
      !quantity ||
      !unitPrice ||
      !totalPrice ||
      !taxRate ||
      !invoiceStatus ||
      !dueDate
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newInvoice = new TaxInvoice({
      invoiceNo: invoiceNo.trim(),
      workOrderNo: workOrderNo.trim(),
      invoiceDate: new Date(invoiceDate),
      itemDescription: itemDescription.trim(),
      quantity,
      unitPrice,
      totalPrice,
      taxRate,
      invoiceStatus: invoiceStatus.trim(),
      dueDate: new Date(dueDate),
    });

    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    console.error("Error details:", error.stack);
    res.status(500).json({
      message: "An unexpected server error occurred",
      error: error.message,
    });
  }
});

// PUT route to update an existing tax invoice by its ID
app.put("/taxInvoices/:id", async (req, res) => {
  try {
    const updates = req.body;
    const updatedInvoice = await TaxInvoice.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Tax invoice not found" });
    }

    res.json(updatedInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE route to delete a tax invoice by its ID
app.delete("/taxInvoices/:id", async (req, res) => {
  try {
    const deletedInvoice = await TaxInvoice.findByIdAndDelete(req.params.id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: "Tax invoice not found" });
    }

    res.json({ message: "Tax invoice deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Define the Mongoose schema for the SiteEntry model
const siteEntrySchema = new mongoose.Schema({
  materialIn: { type: String, required: true },
  materialOut: { type: String, required: true },
  labourEntry: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

// Create a Mongoose model using the defined schema
const SiteEntry = mongoose.model("SiteEntry", siteEntrySchema);

// GET route to fetch all site entries
app.get("/siteEntries", async (req, res) => {
  try {
    const siteEntries = await SiteEntry.find();
    if (siteEntries.length === 0) {
      return res.status(404).json({ message: "No site entries found" });
    }
    res.json(siteEntries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST route to create a new site entry
app.post("/siteEntries", async (req, res) => {
  try {
    const { materialIn, materialOut, labourEntry } = req.body;

    // Validate required fields
    if (!materialIn || !materialOut || !labourEntry) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSiteEntry = new SiteEntry({
      materialIn: materialIn.trim(),
      materialOut: materialOut.trim(),
      labourEntry: labourEntry.trim(),
    });

    const savedSiteEntry = await newSiteEntry.save();
    res.status(201).json(savedSiteEntry);
  } catch (error) {
    console.error("Error details:", error.stack);
    res
      .status(500)
      .json({
        message: "An unexpected server error occurred",
        error: error.message,
      });
  }
});

// PUT route to update an existing site entry by its ID
app.put("/siteEntries/:id", async (req, res) => {
  try {
    const { materialIn, materialOut, labourEntry } = req.body;

    // Validate required fields
    if (!materialIn || !materialOut || !labourEntry) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedSiteEntry = await SiteEntry.findByIdAndUpdate(
      req.params.id,
      {
        materialIn: materialIn.trim(),
        materialOut: materialOut.trim(),
        labourEntry: labourEntry.trim(),
      },
      { new: true }
    );

    if (!updatedSiteEntry) {
      return res.status(404).json({ message: "Site entry not found" });
    }

    res.json(updatedSiteEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE route to delete a site entry by its ID
app.delete("/siteEntries/:id", async (req, res) => {
  try {
    const deletedSiteEntry = await SiteEntry.findByIdAndDelete(req.params.id);

    if (!deletedSiteEntry) {
      return res.status(404).json({ message: "Site entry not found" });
    }

    res.json({ message: "Site entry deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start the Express server on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
