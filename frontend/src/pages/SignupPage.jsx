// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./SignupPage.css";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("normal"); // Default role
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    
    if (!name || !email || !address || !password) {
      toast.error("Please fill in all fields.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          address,
          password,
          role, 
        }
      );
      console.log(response.data); 
      toast.success("Signup successful!", {
        position: "top-right",
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000); 
    } catch (error) {
      console.error(error); 
      if (error.response) {
        const { data } = error.response;
        if (data.error) {
         
          const errorMessage = data.error;
          if (errorMessage.includes("name")) {
            toast.error("Name must be between 20 to 60 characters.", {
              position: "top-right",
              autoClose: 2000,
            });
          } else if (errorMessage.includes("email")) {
            toast.error("Email must be unique and valid.", {
              position: "top-right",
              autoClose: 2000,
            });
          } else if (errorMessage.includes("password")) {
            toast.error(
              "Password must contain at least one uppercase, one lowercase, one digit, and be between 8 to 16 characters.",
              {
                position: "top-right",
                autoClose: 2000,
              }
            );
          } else if (errorMessage.includes("address")) {
            toast.error("Address must contain 400 characters.", {
              position: "top-right",
              autoClose: 2000,
            });
          }
        } else {
          toast.error("Signup failed. Please try again later.", {
            position: "top-right",
            autoClose: 2000,
          });
        }
      }
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup} className="signup-form">
        <h2 className="text-center">Signup Form</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="signup-input"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="signup-input"
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          className="signup-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="signup-input"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: "100%",

            padding: "20px",
            margin: "10px 0",
            borderRadius: "20px",
            border: "5px solid #ddd",
          }}
        >
          <option value="admin">Admin</option>
          <option value="normal">Normal</option>
          <option value="storeOwner">Store Owner</option>
        </select>
        <button type="submit" className="signup-button">
          Signup
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignupPage;
