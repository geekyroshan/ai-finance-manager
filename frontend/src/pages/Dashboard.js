import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { Container, Typography, Box, Button, Grid, Paper, Divider } from "@mui/material";
import TransactionsTable from "../components/TransactionsTable";
import FinancialChart from "../components/FinancialChart";
import CategoryInsights from "../components/CategoryInsights";
import AddTransactionForm from "../components/AddTransactionForm";
import BudgetInsights from "../components/BudgetInsights";
import BudgetForecast from "../components/BudgetForecast";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgetInsights, setBudgetInsights] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const fetchTransactions = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:3002/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactions(res.data);
      if (res.data.length > 0) {
        fetchBudgetInsights(res.data[0].user_id);
        fetchBudgetForecast(res.data[0].user_id);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [navigate]);

  const fetchBudgetInsights = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/budget-insights/${userId}`);
      setBudgetInsights(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching budget insights:", error);
      setLoading(false);
    }
  };

  const fetchBudgetForecast = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/budget-forecast/${userId}?periods=30`);
      setForecastData(res.data);
    } catch (error) {
      console.error("Error fetching budget forecast:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
          mb: 3,
          padding: 2,
          borderRadius: 2,
          bgcolor: darkMode ? "grey.900" : "grey.100",
        }}
      >
        <Typography variant="h4">Dashboard</Typography>
        <Box>
          <Button
            variant="contained"
            onClick={toggleTheme}
            sx={{
              mr: 2,
              bgcolor: darkMode ? "blueGrey.600" : "blueGrey.200",
              "&:hover": { bgcolor: darkMode ? "blueGrey.700" : "blueGrey.300" },
            }}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Top Section: Add Transaction and Budget Forecast side by side */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2, minHeight: "300px" }}>
                <Typography variant="h6" gutterBottom>
                  Add Transaction
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <AddTransactionForm onTransactionAdded={fetchTransactions} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2, minHeight: "300px" }}>
                <BudgetForecast forecast={forecastData} />
              </Paper>
            </Grid>
          </Grid>

          {/* Transactions Table */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, minHeight: "400px", mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Transactions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TransactionsTable transactions={transactions} refreshTransactions={fetchTransactions} />
            </Paper>
          </Grid>
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3, minHeight: "250px" }}>
            <Typography variant="h6" gutterBottom>
              Financial Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <FinancialChart transactions={transactions} />
          </Paper>

          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3, minHeight: "300px" }}>
            <Typography variant="h6" gutterBottom>
              Category Insights
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <CategoryInsights transactions={transactions} />
          </Paper>

          <Box sx={{ mb: 3 }}>
            <BudgetInsights insights={budgetInsights} loading={loading} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
