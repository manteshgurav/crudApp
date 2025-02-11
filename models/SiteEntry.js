const mongoose = require("mongoose");

const siteEntrySchema = new mongoose.Schema({
  materialIn: { type: String, required: true },
  materialOut: { type: String, required: true },
  labourEntry: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SiteEntry", siteEntrySchema);
