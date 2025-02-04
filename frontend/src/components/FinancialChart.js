import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";
import { ThemeContext } from "../context/ThemeContext";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FinancialChart = ({ transactions }) => {
  const { darkMode } = useContext(ThemeContext); // ✅ Get Dark Mode state

  const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  const data = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Amount ($)",
        data: [income, expenses],
        backgroundColor: ["#4CAF50", "#F44336"], // Green for Income, Red for Expenses
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: darkMode ? "#FFFFFF" : "#333333" } // ✅ Text color changes
      },
      tooltip: {
        backgroundColor: darkMode ? "#333" : "#FFF", // ✅ Tooltip dark/light mode
        titleColor: darkMode ? "#FFF" : "#000",
        bodyColor: darkMode ? "#FFF" : "#000"
      }
    },
    scales: {
      x: {
        ticks: { color: darkMode ? "#FFFFFF" : "#333333" }, // ✅ X-axis label color
        grid: { color: darkMode ? "#555" : "#ddd" } // ✅ Grid lines color
      },
      y: {
        ticks: { color: darkMode ? "#FFFFFF" : "#333333" }, // ✅ Y-axis label color
        grid: { color: darkMode ? "#555" : "#ddd" } // ✅ Grid lines color
      }
    }
  };

  return (
    <Box sx={{ height: 300 }}>
      <Typography variant="h6" gutterBottom>Financial Summary</Typography>
      <Bar data={data} options={options} />
    </Box>
  );
};

export default FinancialChart;
