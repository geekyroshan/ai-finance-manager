import React from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Card, CardContent, Typography, Divider } from "@mui/material";

const BudgetForecast = ({ forecast }) => {
  if (!forecast || forecast.length === 0) {
    return <Typography variant="body2">No forecast data available.</Typography>;
  }

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3, mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
          📊 Budget Forecast for Upcoming Period
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={forecast} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="ds" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} tick={{ fill: "#555" }} />
            <YAxis tick={{ fill: "#555" }} />
            <Tooltip 
              formatter={(value) => `$${value.toFixed(2)}`} 
              labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
              contentStyle={{ backgroundColor: "#f5f5f5", borderColor: "#4caf50" }}
            />
            <Area 
              type="monotone" 
              dataKey="yhat" 
              stroke="#4caf50" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorForecast)" 
              name="Predicted Budget" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BudgetForecast;
