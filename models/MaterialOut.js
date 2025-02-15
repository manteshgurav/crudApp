const mongoose = require("mongoose");

const materialOutSchema = new mongoose.Schema({
  date: { type: Date },
  materialDetails: { type: String }, // Material description
  qty: { type: Number }, // Quantity
  amt: { type: Number }, // Amount
});

module.exports = mongoose.model("MaterialOut", materialOutSchema);
