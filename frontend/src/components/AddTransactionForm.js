import React, { useState } from "react";
import { Box, TextField, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import axios from "axios";

const AddTransactionForm = ({ onTransactionAdded }) => {
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const categories = {
    income: ["Salary", "Other"],
    expense: ["Food", "Rent", "Entertainment", "Travel", "Health", "Shopping", "Other"]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3002/api/transactions", {
        type,
        category,
        amount,
        date
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCategory("");
      setAmount("");
      setDate("");
      onTransactionAdded(); // Refresh transactions list
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <FormControl fullWidth>
        <InputLabel>Type</InputLabel>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories[type].map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} fullWidth />
      <TextField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
      
      <Button type="submit" variant="contained" fullWidth>Add Transaction</Button>
    </Box>
  );
};

export default AddTransactionForm;
