import React, { useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Box, Typography } from "@mui/material";

// ✅ Register Chart.js components correctly
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FinancialChart = ({ transactions }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    return () => {
      if (chartRef.current && chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }
    };
  }, []);

  const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  const data = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Amount ($)",
        data: [income, expenses],
        backgroundColor: ["#4CAF50", "#F44336"]
      }
    ]
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Financial Summary</Typography>
      <Bar ref={chartRef} data={data} />
    </Box>
  );
};

export default FinancialChart;
