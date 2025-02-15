require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const quotationRoutes = require("./routes/quotations");
const taxInvoiceRoutes = require("./routes/taxInvoices");
const materialInRoutes = require("./routes/materialInRoutes"); // Added Material In Routes
const materialOutRoutes = require("./routes/materialOutRoutes"); // Added Material Out Routes

// Load environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
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

// Use routes
app.use("/quotations", quotationRoutes);
app.use("/taxInvoices", taxInvoiceRoutes);
app.use("/materialin", materialInRoutes); // Updated Route
app.use("/materialout", materialOutRoutes); // Updated Route

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
