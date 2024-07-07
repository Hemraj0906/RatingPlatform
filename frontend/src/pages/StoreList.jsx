

// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddStoreModal from "../components/AddStoreModal";
import LogoutButton from "../components/LogoutButton";
import "./StoreList.css";

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStores = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(
          `http://localhost:5000/api/stores/user/${userId}`,
          config
        );
        const storeData = response.data;
        setStores(storeData);

        const ratingsData = {};
        for (const store of storeData) {
          const ratingsResponse = await axios.get(
            `http://localhost:5000/api/stores/${store._id}/ratings`,
            config
          );
          ratingsData[store._id] = ratingsResponse.data;
        }
        setRatings(ratingsData);
      } catch (error) {
        console.error("Failed to fetch stores:", error.message);
        toast.error("Failed to fetch stores.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserStores();
  }, []);

  const handleDeleteStore = async (storeId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(`http://localhost:5000/api/stores/${storeId}`, config);
      setStores(stores.filter((store) => store._id !== storeId));
      toast.success("Store deleted successfully!");
      
     window.location.reload();
    } catch (error) {
      console.error("Failed to delete store:", error.message);
      toast.error("Failed to delete store.");
    }
  };

  const handleStoreAdded = (newStore) => {
    setStores([...stores, newStore]);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard"); 
  };

  return (
    <div className="store-list">
      <ToastContainer />
      <LogoutButton />
      <button className="btn-secondary" onClick={handleBackToDashboard}>
        Back to Dashboard
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : stores.length === 0 ? (
        <div className="empty-stores">
          <h1>You haven't created any stores yet.</h1>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            Create Store
          </button>
        </div>
      ) : (
        <>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            Add Store
          </button>
          <table className="store-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Average Rating</th>
                <th>Users who Rated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store._id}>
                  <td>{store.name}</td>
                  <td>{store.address}</td>
                  <td>
                    {store.ratings.length > 0
                      ? (
                          store.ratings.reduce(
                            (acc, rating) => acc + rating.value,
                            0
                          ) / store.ratings.length
                        ).toFixed(2)
                      : "N/A"}
                  </td>
                  <td>
                    <ul>
                      {ratings[store._id]?.map((rating) =>
                        rating.userId ? (
                          <li key={rating.userId._id}>
                            {rating.userId.name} ({rating.userId.email})
                          </li>
                        ) : (
                          <li key={rating._id}>Unknown User</li>
                        )
                      )}
                    </ul>
                  </td>
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

      {isModalOpen && (
        <AddStoreModal
          onClose={() => setIsModalOpen(false)}
          onStoreAdded={handleStoreAdded}
        />
      )}
    </div>
  );
};

export default StoreList;
