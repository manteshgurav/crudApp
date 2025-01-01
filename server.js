// Import required libraries
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Set up port and MongoDB connection URI from environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: { w: 1 }
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
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
  dueDate: { type: Date, required: true }
});

// Create a Mongoose model using the defined schema
const TaxInvoice = mongoose.model('TaxInvoice', taxInvoiceSchema);

// Define the CRUD Routes

// GET route to fetch all tax invoices
app.get('/taxInvoices', async (req, res) => {
  try {
    const taxInvoices = await TaxInvoice.find();
    if (taxInvoices.length === 0) {
      return res.status(404).json({ message: 'No tax invoices found' });
    }
    res.json(taxInvoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST route to create a new tax invoice
app.post('/taxInvoices', async (req, res) => {
  try {
    const {
      invoiceNo, workOrderNo, invoiceDate, itemDescription,
      quantity, unitPrice, totalPrice, taxRate, invoiceStatus, dueDate
    } = req.body;

    // Validate required fields
    if (!invoiceNo || !workOrderNo || !invoiceDate || !itemDescription ||
        !quantity || !unitPrice || !totalPrice || !taxRate || !invoiceStatus || !dueDate) {
      return res.status(400).json({ message: 'All fields are required' });
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
      dueDate: new Date(dueDate)
    });

    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    console.error('Error details:', error.stack);
    res.status(500).json({ message: 'An unexpected server error occurred', error: error.message });
  }
});

// PUT route to update an existing tax invoice by its ID
app.put('/taxInvoices/:id', async (req, res) => {
  try {
    const updates = req.body;
    const updatedInvoice = await TaxInvoice.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Tax invoice not found' });
    }

    res.json(updatedInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE route to delete a tax invoice by its ID
app.delete('/taxInvoices/:id', async (req, res) => {
  try {
    const deletedInvoice = await TaxInvoice.findByIdAndDelete(req.params.id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: 'Tax invoice not found' });
    }

    res.json({ message: 'Tax invoice deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the Express server on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
