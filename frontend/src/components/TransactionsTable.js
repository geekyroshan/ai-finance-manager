import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const TransactionsTable = ({ transactions }) => {
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "type", headerName: "Type", width: 130 },
    { field: "category", headerName: "Category", width: 180 },
    { field: "amount", headerName: "Amount ($)", width: 130, type: "number" },
    { field: "date", headerName: "Date", width: 180 }
  ];

  let filteredTransactions = transactions;
  
  if (filterType !== "all") {
    filteredTransactions = transactions.filter(t => t.type === filterType);
  }

  filteredTransactions.sort((a, b) => {
    if (sortBy === "amount") return b.amount - a.amount; // Sort by amount (high to low)
    return new Date(b.date) - new Date(a.date); // Default: Sort by date (latest first)
  });

  const rows = filteredTransactions.map((t, index) => ({
    id: index + 1,
    type: t.type,
    category: t.category,
    amount: t.amount,
    date: new Date(t.date).toLocaleDateString()
  }));

  return (
    <Box sx={{ height: 450, width: "100%" }}>
      <Typography variant="h6" gutterBottom>Transactions</Typography>
      
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
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </Box>
  );
};

export default TransactionsTable;
