// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, onRate, canDelete, onDelete }) => {
  const [hover, setHover] = useState(null);

  const handleRatingClick = (ratingValue) => {
    onRate(ratingValue);
  };

  const handleDeleteClick = () => {
    onDelete();
  };

  return (
    <div>
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => handleRatingClick(ratingValue)}
            />
            <FaStar
              className="star"
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
      {canDelete && (
        <button onClick={handleDeleteClick} className="delete-btn">
          Delete Rating
        </button>
      )}
    </div>
  );
};

export default StarRating;
