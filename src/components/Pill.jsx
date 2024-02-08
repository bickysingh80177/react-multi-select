import React from "react";

const Pill = ({ image, text, handleClick }) => {
  return (
    <span className="pill-section">
      <img src={image} alt={text} />
      <span>{text}</span>{" "}
      <span onClick={handleClick} className="remove-item">
        &times;
      </span>
    </span>
  );
};

export default Pill;
