const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Middleware to Verify JWT Token
const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied. No Token Provided." });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Transactions Schema
const TransactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});
const Transaction = mongoose.model("Transaction", TransactionSchema);

// Get Transactions (Only for Logged-In User)
app.get("/api/transactions", authenticateUser, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user_id: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching transactions", error: err.message });
  }
});

// Add Transaction
app.post("/api/transactions", authenticateUser, async (req, res) => {
  try {
    const { type, category, amount, date } = req.body;
    
    // Validate Transaction Type
    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    const transaction = new Transaction({ user_id: req.user.id, type, category, amount, date });
    await transaction.save();
    res.status(201).json({ message: "Transaction added", transaction });
  } catch (err) {
    res.status(500).json({ message: "Error adding transaction", error: err.message });
  }
});

// API Test Route
app.get("/", (req, res) => {
  res.send("✅ AI Finance Manager API is Running...");
});

// Load Authentication Routes
app.use("/api/auth", authRoutes);

// Start Server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
