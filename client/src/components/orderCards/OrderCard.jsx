import React from "react";
import "./OrderCard.css";

const OrderCard = ({ productname, price, image, status, onCancel }) => {
  return (
    <div
      className="order-card"
      style={{
        opacity: status === "CANCEL_REQUESTED" ? 0.6 : 1,
      }}
    >
      <img src={image} alt="product" className="order-image" />

      <div className="order-info">
        <h3>{productname}</h3>
        <p>${price}</p>

        {status === "PLACED" && (
          <button className="cancel-btn" onClick={onCancel}>
            Cancel Order
          </button>
        )}

        {status === "CANCEL_REQUESTED" && (
          <p className="pending-text">Under Verification</p>
        )}

        {status === "DELIVERED" && <p className="delivered-text">Delivered</p>}

        {status === "CANCELLED" && (
          <p className="cancelled-text">Order Cancelled</p>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
