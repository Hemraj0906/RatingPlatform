// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddStoreModal from "../components/AddStoreModal";
import AddUserModal from "../components/AddUserModal";

import StoreList from "../pages/StoreList";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [initialStats, setInitialStats] = useState({ users: 0, stores: 0 });
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const usersResponse = await axios.get(
          "http://localhost:5000/api/users",
          config
        );
        setUsers(usersResponse.data);

        const storesResponse = await axios.get(
          "http://localhost:5000/api/stores",
          config
        );
        setStores(storesResponse.data);

        const updatedStats = {
          users: usersResponse.data.length,
          stores: storesResponse.data.length,
          ratings: 0,
        };

        setStats(updatedStats);
        setInitialStats(updatedStats);
      } catch (error) {
        toast.error("Failed to fetch admin data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (
      stats.users !== initialStats.users ||
      stats.stores !== initialStats.stores
    ) {
      window.location.reload();
    }
  }, [stats, initialStats]);

  const handleStoreAdded = (newStore) => {
    setStats((prevStats) => ({ ...prevStats, stores: prevStats.stores + 1 }));
    setStores([...stores, newStore]);
  };

  const handleUserAdded = (newUser) => {
    setUsers([...users, newUser]);
    setStats((prevStats) => ({ ...prevStats, users: prevStats.users + 1 }));
  };

  const handleDeleteUser = async (userId, userRole) => {
    try {
      // if (userRole !== "admin") {
      //   toast.error("You are not authorized to delete users.");
      //   return; // Exit function early if not authorized
      // }

      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.delete(`http://localhost:5000/api/users/${userId}`, config);

      setUsers(users.filter((user) => user._id !== userId));

      toast.success("User deleted successfully!");
      setStats((prevStats) => ({ ...prevStats, users: prevStats.users - 1 }));
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  const handleDeleteStore = async (storeId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(`http://localhost:5000/api/stores/${storeId}`, config);
      setStores(stores.filter((store) => store._id !== storeId));
      toast.success("Store deleted successfully!");
      setStats((prevStats) => ({ ...prevStats, stores: prevStats.stores - 1 }));
    } catch (error) {
      toast.error("Failed to delete store.");
    }
  };

  return (
    <div className="admin-dashboard">
      <ToastContainer />
      <h1>Admin Dashboard</h1>
      <div className="stats">
        <p>Total Users: {stats.users}</p>
        <p>Total Stores: {stats.stores}</p>
      </div>
      <h4>Store created by Admin</h4>
      <StoreList />
      <button className="btn-primary" onClick={() => setIsUserModalOpen(true)}>
        Add User
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>Users</h2>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="btn-danger"
                      onClick={() => handleDeleteUser(user._id, user.role)}
                    >
                      Delete User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Stores created by Admin and StoreOwner All store</h2>
          <table className="store-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store._id}>
                  <td>{store.name}</td>
                  <td>{store.email}</td>
                  <td>{store.address}</td>
                  <td>
                    <button
                      className="btn-danger"
                      onClick={() => handleDeleteStore(store._id)}
                    >
                      Delete Store
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {isStoreModalOpen && (
        <AddStoreModal
          onClose={() => setIsStoreModalOpen(false)}
          onStoreAdded={handleStoreAdded}
        />
      )}
      {isUserModalOpen && (
        <AddUserModal
          onClose={() => setIsUserModalOpen(false)}
          onUserAdded={handleUserAdded}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
