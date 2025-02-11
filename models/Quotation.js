const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  unit: { type: String, required: true },
  qty: { type: Number, required: true },
  rate: { type: Number, required: true },
  total: { type: Number },
});

module.exports = mongoose.model("Quotation", quotationSchema);
