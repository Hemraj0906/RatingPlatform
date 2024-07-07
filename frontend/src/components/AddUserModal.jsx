// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddUserModal.css";

const AddUserModal = ({ onClose, onUserAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("normal");

  const refreshPage = () => {
       window.location.reload();
     };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
          address,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newUser = response.data;
      onUserAdded(newUser);
      toast.success("User added successfully!");
      onClose();
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
      } else {
        toast.error("Failed to add user.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add User</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Name"
              className="input-field"
            />
          </div>
          <div className="input-container">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="input-field"
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="input-field"
            />
          </div>
          <div className="input-container">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Address"
              className="input-field"
            />
          </div>
          <div
            style={{
              width: "100%",
              height: "40px",

              padding: "20px",
              margin: "5px",
              borderRadius: "50px",
            }}
          >
            <div>
              <select
                style={{
                  width: "70%",
                  height: "50px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  fontSize: "16px",
                  backgroundColor: "white",

                  cursor: "pointer",
                }}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="admin">StoreOwner</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="button-primary"
            onClick={refreshPage}
          >
            Add User
          </button>
          <button type="button" onClick={onClose} className="button-secondary">
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;


