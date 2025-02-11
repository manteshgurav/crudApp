const mongoose = require("mongoose");

const taxInvoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String },
  workOrderNo: { type: String },
  invoiceDate: { type: Date },
  itemDescription: { type: String },
  quantity: { type: Number },
  unitPrice: { type: Number },
  totalPrice: { type: Number },
  taxRate: { type: Number },
  invoiceStatus: { type: String },
  dueDate: { type: Date },
});

module.exports = mongoose.model("TaxInvoice", taxInvoiceSchema);
