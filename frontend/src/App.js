import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ThemeProviderWrapper from "./context/ThemeContext";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleAuthChange);
    return () => window.removeEventListener("storage", handleAuthChange);
  }, []);

  return (
    <ThemeProviderWrapper>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <Register setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Router>
    </ThemeProviderWrapper>
  );
}

export default App;
