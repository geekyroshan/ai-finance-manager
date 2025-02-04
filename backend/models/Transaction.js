const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { 
    type: String, 
    enum: ["Food", "Rent", "Entertainment", "Travel", "Health", "Shopping", "Salary", "Other"], 
    required: true 
  },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
