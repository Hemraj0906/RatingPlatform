


// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify"; 
import { debounce } from "../utils/utils.js";
import "./Dashboard.css";
import LogoutButton from "../components/LogoutButton";

const Dashboard = () => {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState(null);
  const [hasRated, setHasRated] = useState({});
  const [loading, setLoading] = useState({});

  const fetchStores = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token, authorization denied");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/stores", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStores(response.data);

      // Set initial rating status
      const userId = localStorage.getItem("userId");
      const initialHasRated = response.data.reduce((acc, store) => {
        acc[store._id] = store.ratings.some(
          (rating) => rating.userId === userId
        );
        return acc;
      }, {});
      setHasRated(initialHasRated);
    } catch (error) {
      setError("Error fetching stores. Please try again.");
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleRateStore = useCallback(
    debounce(async (storeId, rating) => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token, authorization denied");
        return;
      }

      setLoading((prev) => ({ ...prev, [storeId]: true }));

      try {
        const response = await axios.post(
          `http://localhost:5000/api/stores/${storeId}/rate`,
          { rating },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(`Rated store with ${rating} stars!`);

        // Update the local state to mark which stars are active
        setHasRated((prev) => ({
          ...prev,
          [storeId]: true,
        }));

        // Update the store in the stores array with the new rating
        setStores((prevStores) =>
          prevStores.map((store) =>
            store._id === storeId ? response.data : store
          )
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Error rating store. Please try again."
        );
      } finally {
        setLoading((prev) => ({ ...prev, [storeId]: false }));
      }
    }, 500),
    []
  );

  const handleDeleteRating = async (storeId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token, authorization denied");
      return;
    }

    if (!hasRated[storeId]) {
      toast.error(
        "You haven't rated this store. You can't delete before rating!"
      );
      return;
    }

    setLoading((prev) => ({ ...prev, [storeId]: true }));

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/stores/${storeId}/rate`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.info("Rating deleted successfully!");
      setHasRated((prev) => ({ ...prev, [storeId]: false }));
      fetchStores(); // Fetch updated store data after deleting rating
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error deleting rating. Please try again."
      );
    } finally {
      setLoading((prev) => ({ ...prev, [storeId]: false }));
    }
  };

  // Function to calculate average rating based on ratings array
  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const totalRating = ratings.reduce((sum, rating) => sum + rating.value, 0);
    return totalRating / ratings.length;
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <LogoutButton />
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table className="store-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Average Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => {
              const userId = localStorage.getItem("userId");
              return (
                <tr key={store._id}>
                  <td>{store.name}</td>
                  <td>{store.email}</td>
                  <td>{store.address}</td>
                  <td>{calculateAverageRating(store.ratings).toFixed(1)}</td>
                  <td>
                    <div className="rating-actions">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => handleRateStore(store._id, star)}
                          className={`star ${
                            star <= calculateAverageRating(store.ratings)
                              ? "active"
                              : ""
                          } ${
                            hasRated[store._id] &&
                            star <= calculateAverageRating(store.ratings)
                              ? "rated"
                              : ""
                          }`}
                          style={{
                            pointerEvents: loading[store._id] ? "none" : "auto",
                          }}
                        >
                          &#9733;
                        </span>
                      ))}
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteRating(store._id)}
                        disabled={loading[store._id]}
                      >
                        {loading[store._id] ? "Loading..." : "Delete Rating"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;

