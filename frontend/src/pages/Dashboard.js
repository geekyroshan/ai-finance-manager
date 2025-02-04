import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Container, Typography, Box, Button, Grid, Paper } from "@mui/material";
import TransactionsTable from "../components/TransactionsTable";
import FinancialChart from "../components/FinancialChart";
import AddTransactionForm from "../components/AddTransactionForm";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchTransactions();
    }
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3002/api/transactions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Container maxWidth="xl">
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, mb: 3 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Box>
          <Button variant="contained" onClick={toggleTheme} sx={{ mr: 2 }}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Transactions Table - Takes More Space */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <TransactionsTable transactions={transactions} refreshTransactions={fetchTransactions} />
          </Paper>
        </Grid>

        {/* Right Section (Financial Chart + Add Transaction) */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <FinancialChart transactions={transactions} />
          </Paper>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <AddTransactionForm onTransactionAdded={fetchTransactions} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
