import React, { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, MenuItem, Typography } from "@mui/material";

const AddTransactionForm = ({ onTransactionAdded }) => {
  const [transaction, setTransaction] = useState({
    type: "expense",
    category: "",
    amount: "",
    date: ""
  });

  const handleChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:3002/api/transactions", transaction, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Transaction Added!");
      setTransaction({ type: "expense", category: "", amount: "", date: "" });
      onTransactionAdded(); // Refresh transactions list
    } catch (error) {
      alert(error.response?.data?.message || "Error adding transaction");
    }
  };

  return (
    <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>Add Transaction</Typography>
      <form onSubmit={handleSubmit}>
        <TextField select label="Type" name="type" value={transaction.type} onChange={handleChange} fullWidth margin="normal">
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </TextField>
        <TextField label="Category" name="category" value={transaction.category} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Amount" name="amount" type="number" value={transaction.amount} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Date" name="date" type="date" value={transaction.date} onChange={handleChange} fullWidth margin="normal" required />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Add Transaction</Button>
      </form>
    </Box>
  );
};

export default AddTransactionForm;
