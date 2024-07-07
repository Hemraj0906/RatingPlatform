





// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      console.log("Login response:", response);
      const { token, role, userId } = response.data;

      // Store token, role, and userId in local storage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      // Log the token, role, and userId to ensure they're being set correctly
      console.log("Stored token:", localStorage.getItem("token"));
      console.log("Stored role:", localStorage.getItem("role"));
      console.log("Stored userId:", localStorage.getItem("userId"));

    
      // Redirect based on role
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "storeOwner") {
        navigate("/stores");
      } else if (role === "normal") {
        navigate("/dashboard");
      } else {
        console.error("Unknown role:", role);
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(
        "Login failed. Please check your credentials and try again.",
        { position: "top-right", autoClose: 3000 }
      );
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Login Page</h2>
      <div className="login-form-container">
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="login-input"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="login-input"
            required
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
