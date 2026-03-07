import React from "react";
import { FaHeart, FaStar } from "react-icons/fa";
import "./ProductCards.css";

const ProductCards = ({
  productname = "Cool T-Shirt",
  actualValue = 234,
  discountValue = 267,
  startValue = 3,
  reviewsCount = 64,
  image = "https://picsum.photos/200/300",
  onClick,
}) => {
  return (
    <div
      className="product-card"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className="product-header">
        <FaHeart className="heart-icon" title="Add to Wishlist" />
      </div>

      <img src={image} alt="product" className="product-image" />

      <div className="product-info">
        <h3 className="product-name">{productname}</h3>

        <p className="product-description">
          <del>${discountValue}</del> ${actualValue}
        </p>

        <button className="add-to-cart">Add to Cart</button>

        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              style={{
                color: i < startValue ? "#ffc107" : "#ccc",
              }}
            />
          ))}
          <span className="review-count">({reviewsCount})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCards;
