// eslint-disable-next-line no-unused-vars
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.post(`http://localhost:5000/api/auth/logout`, {}, config);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      toast.success("Logged out successfully!");
      navigate("/"); 
    } catch (error) {
      console.error("Failed to logout:", error.message);
      toast.error("Failed to logout.");
    }
  };

  return (
    <button className="btn-primary" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
