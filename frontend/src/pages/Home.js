import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to AI-Powered Personal Finance Manager
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Take control of your finances with smart insights and AI-powered tracking.
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={() => navigate("/login")}>
          Login
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate("/register")}>
          Signup
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
