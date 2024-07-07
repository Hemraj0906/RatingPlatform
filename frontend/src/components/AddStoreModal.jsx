

// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddStoreModal.css";

const AddStoreModal = ({ onClose, onStoreAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); 
      console.log("-----HH-----", userId);

      const response = await axios.post(
        "http://localhost:5000/api/stores",
        {
          name,
          email,
          address,
          ratings: [
            { userId, value: 4 }, 
            
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     
      const newStore = response.data.data;
      onStoreAdded(newStore);

     
      toast.success("Store added successfully!");

      onClose();
      // Reload the page
      window.location.reload();
    } catch (error) {
      toast.error("Failed to add store.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Store</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Store Name"
              className="input-field"
            />
          </div>
          <div className="input-container">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Store Email"
              className="input-field"
            />
          </div>
          <div className="input-container">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Store Address"
              className="input-field"
            />
          </div>
          <button type="submit" className="button-primary">
            Add Store
          </button>
          <button type="button" onClick={onClose} className="button-secondary">
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStoreModal;
