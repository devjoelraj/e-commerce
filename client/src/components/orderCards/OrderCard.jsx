import React from "react";
import "./OrderCard.css";

const OrderCard = ({ productname, price, image, status, onCancel }) => {
  const getStatusDisplay = () => {
    switch (status) {
      case "pending":
        return { text: "Pending", color: "#ff9800" };
      case "shipped":
        return { text: "Shipped", color: "#2196f3" };
      case "delivered":
        return { text: "Delivered", color: "#4caf50" };
      case "cancelled":
        return { text: "Cancelled", color: "#f44336" };
      default:
        return { text: status, color: "#888" };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="order-card">
      <img src={image} alt="product" className="order-image" />
      <div className="order-info">
        <h3>{productname}</h3>
        <p>₹{price}</p>
        <p style={{ color: statusDisplay.color, fontWeight: "bold" }}>
          {statusDisplay.text}
        </p>
        {status === "pending" && onCancel && (
          <button className="cancel-btn" onClick={onCancel}>
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
