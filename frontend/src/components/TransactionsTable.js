import React, { useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Paper,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";

const TransactionsTable = ({ transactions, refreshTransactions }) => {
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [editTransaction, setEditTransaction] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { darkMode } = useContext(ThemeContext);

  // ✅ Fix for "Invalid time value" error
  const handleEdit = (transaction) => {
    let formattedDate = "";

    if (transaction.date) {
      const parsedDate = new Date(transaction.date);
      if (!isNaN(parsedDate.getTime())) { 
        formattedDate = parsedDate.toISOString().split("T")[0]; // ✅ Valid Date Formatting
      }
    }

    setEditTransaction({
      ...transaction,
      date: formattedDate, // ✅ Assign formatted or empty date to avoid "Invalid time value" error
    });
  };

  // ✅ Handle Transaction Update
  const handleUpdate = async () => {
    try {
      if (!editTransaction) return;
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3002/api/transactions/${editTransaction._id}`, editTransaction, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditTransaction(null);
      refreshTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  // ✅ Handle Delete Transaction
  const handleDelete = async () => {
    try {
      if (!confirmDelete) return;
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3002/api/transactions/${confirmDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConfirmDelete(null);
      refreshTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // ✅ Filter Transactions
  let filteredTransactions = transactions;
  if (filterType !== "all") {
    filteredTransactions = filteredTransactions.filter((t) => t.type === filterType);
  }
  if (filterCategory !== "all") {
    filteredTransactions = filteredTransactions.filter((t) => t.category === filterCategory);
  }

  // ✅ Convert transactions into DataGrid rows with Serial Numbers
  const rows = filteredTransactions.map((t, index) => ({
    id: index + 1, // Show Serial Number instead of MongoDB ID
    _id: t._id, // Keep _id hidden but use for updates/deletes
    type: t.type,
    category: t.category,
    amount: t.amount,
    date: new Date(t.date).toLocaleDateString(),
  }));

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        borderRadius: 2,
        padding: 2,
        bgcolor: darkMode ? "grey.900" : "white",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: darkMode ? "white" : "black", fontWeight: "bold" }}
      >
        Transactions
      </Typography>

      {/* Filters Section */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl variant="outlined" size="small">
          <InputLabel>Filter Type</InputLabel>
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small">
          <InputLabel>Filter Category</InputLabel>
          <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Rent">Rent</MenuItem>
            <MenuItem value="Entertainment">Entertainment</MenuItem>
            <MenuItem value="Travel">Travel</MenuItem>
            <MenuItem value="Health">Health</MenuItem>
            <MenuItem value="Shopping">Shopping</MenuItem>
            <MenuItem value="Salary">Salary</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Transactions Table */}
      <Box sx={{ height: 450, width: "100%", overflow: "hidden" }}>
        <DataGrid
          rows={rows}
          columns={[
            { field: "id", headerName: "S. No.", width: 90 },
            { field: "type", headerName: "Type", width: 130 },
            { field: "category", headerName: "Category", width: 180 },
            { field: "amount", headerName: "Amount ($)", width: 130, type: "number" },
            { field: "date", headerName: "Date", width: 180 },
            {
              field: "actions",
              headerName: "Actions",
              width: 150,
              renderCell: (params) => (
                <>
                  <IconButton onClick={() => handleEdit(params.row)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => setConfirmDelete(params.row._id)}>
                    <Delete color="error" />
                  </IconButton>
                </>
              ),
            },
          ]}
          pageSize={5}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <Dialog open={true} onClose={() => setConfirmDelete(null)}>
          <DialogTitle>Are you sure you want to delete this transaction?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Edit Dialog (🔥 Fixed to Include Type & Category Dropdowns) */}
      {editTransaction && (
        <Dialog open={true} onClose={() => setEditTransaction(null)}>
          <DialogTitle>Edit Transaction</DialogTitle>
          <Box sx={{ p: 3 }}>
            {/* Transaction Type Dropdown */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={editTransaction.type}
                onChange={(e) => setEditTransaction({ ...editTransaction, type: e.target.value })}
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>

            {/* Category Dropdown */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={editTransaction.category}
                onChange={(e) => setEditTransaction({ ...editTransaction, category: e.target.value })}
              >
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Rent">Rent</MenuItem>
                <MenuItem value="Entertainment">Entertainment</MenuItem>
                <MenuItem value="Travel">Travel</MenuItem>
                <MenuItem value="Health">Health</MenuItem>
                <MenuItem value="Shopping">Shopping</MenuItem>
                <MenuItem value="Salary">Salary</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField label="Amount" fullWidth value={editTransaction.amount} onChange={(e) => setEditTransaction({ ...editTransaction, amount: e.target.value })} sx={{ mb: 2 }} />
          </Box>
          <DialogActions>
            <Button onClick={() => setEditTransaction(null)}>Cancel</Button>
            <Button onClick={handleUpdate} color="primary">Update</Button>
          </DialogActions>
        </Dialog>
      )}
    </Paper>
  );
};

export default TransactionsTable;
