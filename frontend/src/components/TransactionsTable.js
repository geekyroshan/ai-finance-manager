import React, { useState } from "react";
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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const TransactionsTable = ({ transactions, refreshTransactions }) => {
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [editTransaction, setEditTransaction] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // ✅ Handle Edit Click (Ensure proper data format)
  const handleEdit = (transaction) => {
    setEditTransaction({
      ...transaction,
      date: new Date(transaction.date).toISOString().split("T")[0], // ✅ Convert date for input field
    });
  };

  // ✅ Handle Transaction Update (Fix update issue)
  const handleUpdate = async () => {
    try {
      if (!editTransaction) return;

      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3002/api/transactions/${editTransaction._id}`, editTransaction, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditTransaction(null);
      refreshTransactions(); // ✅ Refresh the table after update
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  // ✅ Handle Delete Transaction
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3002/api/transactions/${confirmDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConfirmDelete(null);
      refreshTransactions(); // ✅ Refresh the table after delete
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // ✅ Filter Transactions
  let filteredTransactions = transactions;
  if (filterType !== "all") {
    filteredTransactions = transactions.filter((t) => t.type === filterType);
  }

  // ✅ Sort Transactions
  filteredTransactions.sort((a, b) => {
    if (sortBy === "amount") return b.amount - a.amount;
    return new Date(b.date) - new Date(a.date);
  });

  // ✅ Convert transactions into DataGrid rows with Serial Numbers
  const rows = filteredTransactions.map((t, index) => ({
    id: index + 1, // ✅ Show Serial Number instead of MongoDB ID
    _id: t._id, // ✅ Keep _id hidden but use for updates/deletes
    type: t.type,
    category: t.category,
    amount: t.amount,
    date: new Date(t.date).toLocaleDateString(),
  }));

  return (
    <Box sx={{ height: 450, width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Transactions
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <FormControl variant="outlined" size="small">
          <InputLabel>Filter</InputLabel>
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} label="Filter">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small">
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort By">
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="amount">Amount</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Transactions Table */}
      <DataGrid
        rows={rows}
        columns={[
          { field: "id", headerName: "S. No.", width: 90 }, // ✅ Show Serial Number
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

      {/* Edit Dialog */}
      {editTransaction && (
        <Dialog open={true} onClose={() => setEditTransaction(null)}>
          <DialogTitle>Edit Transaction</DialogTitle>
          <Box sx={{ p: 3 }}>
            <TextField
              label="Type"
              value={editTransaction.type}
              onChange={(e) => setEditTransaction({ ...editTransaction, type: e.target.value })}
              fullWidth
            />
            <TextField
              label="Category"
              value={editTransaction.category}
              onChange={(e) => setEditTransaction({ ...editTransaction, category: e.target.value })}
              fullWidth
            />
            <TextField
              label="Amount"
              type="number"
              value={editTransaction.amount}
              onChange={(e) => setEditTransaction({ ...editTransaction, amount: e.target.value })}
              fullWidth
            />
            <TextField
              label="Date"
              type="date"
              value={editTransaction.date}
              onChange={(e) => setEditTransaction({ ...editTransaction, date: e.target.value })}
              fullWidth
            />
          </Box>
          <DialogActions>
            <Button onClick={() => setEditTransaction(null)}>Cancel</Button>
            <Button onClick={handleUpdate} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <Dialog open={true} onClose={() => setConfirmDelete(null)}>
          <DialogTitle>Are you sure you want to delete this transaction?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default TransactionsTable;
