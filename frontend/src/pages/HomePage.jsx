

// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      <div className="star-rating-initial">
        <span className="stars">&#9733;</span>
        <span className="stars">&#9733;</span>
        <span className="stars">&#9733;</span>
        <span className="stars">&#9733;</span>
        <span className="stars">&#9733;</span>
      </div>
      <h2>Welcome to the Store Rating Platform</h2>
      <p>
        Please{" "}
        <Link to="/login" className="button">
          Login
        </Link>{" "}
        or{" "}
        <Link to="/signup" className="button">
          Signup
        </Link>{" "}
        to continue.
      </p>
    </div>
  );
};

export default HomePage;
