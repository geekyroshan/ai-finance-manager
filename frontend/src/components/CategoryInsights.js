import React, { useContext } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";
import { ThemeContext } from "../context/ThemeContext";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const CategoryInsights = ({ transactions }) => {
  const { darkMode } = useContext(ThemeContext); // ✅ Dark Mode State

  // Extract Expense Data
  const expenseTransactions = transactions.filter(t => t.type === "expense");

  const categoryTotals = expenseTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  const pieData = {
    labels,
    datasets: [
      {
        label: "Expenses by Category",
        data: values,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0", "#FF9800", "#D32F2F"],
        borderColor: darkMode ? "#FFFFFF" : "#333333",
      }
    ]
  };

  const barData = {
    labels,
    datasets: [
      {
        label: "Expenses by Category",
        data: values,
        backgroundColor: "#36A2EB",
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: darkMode ? "#FFFFFF" : "#333333" } // ✅ Legend color
      },
      tooltip: {
        backgroundColor: darkMode ? "#333" : "#FFF", // ✅ Tooltip background color
        titleColor: darkMode ? "#FFF" : "#000",
        bodyColor: darkMode ? "#FFF" : "#000"
      }
    },
    scales: {
      x: {
        ticks: { color: darkMode ? "#FFFFFF" : "#333333" },
        grid: { color: darkMode ? "#555" : "#ddd" }
      },
      y: {
        ticks: { color: darkMode ? "#FFFFFF" : "#333333" },
        grid: { color: darkMode ? "#555" : "#ddd" }
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Expenses by Category</Typography>
      <Box sx={{ height: 250 }}>
        <Pie data={pieData} options={options} />
      </Box>
      <Box sx={{ height: 250, mt: 3 }}>
        <Bar data={barData} options={options} />
      </Box>
    </Box>
  );
};

export default CategoryInsights;
