import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3002/api/auth/login", { email, password });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token); // ✅ Save Token
        setIsAuthenticated(true); // ✅ Update Authentication State
        alert("Login successful!"); 
        navigate("/dashboard"); // ✅ Redirect to Dashboard after login
      }
    } catch (error) {
      alert("Invalid Credentials. Please try again.");
      console.error("Login Error:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
