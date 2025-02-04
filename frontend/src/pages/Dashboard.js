import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Box, Button, Grid } from "@mui/material";
import TransactionsTable from "../components/TransactionsTable";
import FinancialChart from "../components/FinancialChart";
import AddTransactionForm from "../components/AddTransactionForm";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3002/api/transactions", { // ✅ Port 3002
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TransactionsTable transactions={transactions} />
          </Grid>
          <Grid item xs={12} md={4}>
            <FinancialChart transactions={transactions} />
            <AddTransactionForm onTransactionAdded={fetchTransactions} />
          </Grid>
        </Grid>
        <Button variant="contained" color="secondary" onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
