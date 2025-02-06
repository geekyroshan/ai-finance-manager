import React, { useContext, useState } from "react";
import { Card, CardContent, Typography, Box, Alert, Divider, List, ListItem, ListItemIcon, ListItemText, LinearProgress, IconButton } from "@mui/material";
import { TrendingUp, Warning, ErrorOutline, Close } from "@mui/icons-material";
import { ThemeContext } from "../context/ThemeContext";

const BudgetInsights = ({ insights }) => {
  const { darkMode } = useContext(ThemeContext);
  const [dismissedAnomalies, setDismissedAnomalies] = useState([]);

  if (!insights || insights.error) {
    return (
      <Alert severity="error">
        Unable to fetch budget insights. {insights?.error || "Please try again later."}
      </Alert>
    );
  }

  const { total_income, total_expense, suggested_budget, anomalies, category_expenses } = insights;

  const handleDismiss = (category) => {
    setDismissedAnomalies([...dismissedAnomalies, category]);
  };

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3, mt: 2, bgcolor: darkMode ? "grey.900" : "white" }}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", color: darkMode ? "#ddd" : "#333" }}
        >
          <TrendingUp sx={{ verticalAlign: "middle", mr: 1, color: "primary.main" }} />
          AI-Powered Budget Insights
        </Typography>
        <Divider sx={{ mb: 2, bgcolor: darkMode ? "#555" : "#ccc" }} />

        {/* Income & Expense Summary */}
        <Typography variant="body1" sx={{ color: darkMode ? "#ddd" : "#333" }}>
          <b>Total Income:</b> ${total_income}
        </Typography>
        <Typography variant="body1" sx={{ color: "error.main" }}>
          <b>Total Expense:</b> ${total_expense}
        </Typography>

        <Divider sx={{ my: 2, bgcolor: darkMode ? "#555" : "#ccc" }} />

        {/* Suggested Budget Allocation */}
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1, color: darkMode ? "#ddd" : "#333" }}>
          Suggested Budget Allocation:
        </Typography>
        <List dense>
          {Object.entries(suggested_budget).map(([category, amount]) => {
            const spent = category_expenses[category] || 0;
            const percentage = ((spent / total_income) * 100).toFixed(2);
            const progressColor = percentage > 100 ? "red" : percentage > 50 ? "orange" : "green";

            return (
              <ListItem key={category} sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: darkMode ? "#bbb" : "#333" }}
                  >
                    {category}: ${amount.toFixed(2)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      backgroundColor: darkMode ? "#444" : "#e0e0e0",
                      "& .MuiLinearProgress-bar": { backgroundColor: progressColor },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: darkMode ? "#999" : "textSecondary" }}>
                    Spent: ${spent} ({percentage}% of income)
                  </Typography>
                </Box>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 2, bgcolor: darkMode ? "#555" : "#ccc" }} />

        {/* Budget Anomalies Section */}
        {Object.keys(anomalies).length > 0 && (
          <Alert severity="warning" icon={<ErrorOutline fontSize="inherit" />} sx={{ mt: 2, borderRadius: 1, bgcolor: darkMode ? "#664400" : "#ffcc80" }}>
            <Typography variant="body1" sx={{ fontWeight: "bold", color: darkMode ? "#ffcc00" : "red" }}>
              🚨 Budget Anomalies Detected:
            </Typography>
            <List dense>
              {Object.entries(anomalies)
                .filter(([category]) => !dismissedAnomalies.includes(category))
                .map(([category, message]) => (
                  <ListItem key={category} sx={{ display: "flex", alignItems: "center" }}>
                    <ListItemIcon>
                      <Warning color="error" />
                    </ListItemIcon>
                    <ListItemText primary={`${category}: ${message}`} sx={{ color: darkMode ? "#ffcc00" : "#333" }} />
                    <IconButton onClick={() => handleDismiss(category)} size="small">
                      <Close fontSize="small" sx={{ color: darkMode ? "#ffcc00" : "red" }} />
                    </IconButton>
                  </ListItem>
                ))}
            </List>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetInsights;
