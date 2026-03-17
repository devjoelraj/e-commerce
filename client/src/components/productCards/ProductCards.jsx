import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import {
  addToWatchlistService,
  removeFromWatchlistService,
} from "../../api/userServices/productsServices";
import "./ProductCards.css";
import presentToast from "../Toast/Toast";
const ProductCards = ({
  productId,
  category,
  productname = "please refresh the page",
  actualValue = 404,
  discountValue = 404,
  startValue = 0,
  reviewsCount = 404,
  image = "https://picsum.photos/200/300",
  onClick,
  isWishlisted = false,
}) => {
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [loading, setLoading] = useState(false);

  const handleWatchlist = async (e) => {
    e.stopPropagation();

    if (loading) return;

    setLoading(true);

    try {
      if (wishlisted) {
        const res = await removeFromWatchlistService(productId, category);
        if (res?.success) {
          setWishlisted(false);
        }
      } else {
        const res = await addToWatchlistService(productId, category);
        console.log(res.message, "m");
        if (res?.success) {
          setWishlisted(true);
        } else {
          presentToast.error(res.message || "Failed to add to watchlist");
        }
      }
    } catch (error) {
      console.error("Watchlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="product-card"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className="product-header">
        {loading ? (
          <div className="heart-loader"></div>
        ) : wishlisted ? (
          <FaHeart
            className="heart-icon filled-heart"
            onClick={handleWatchlist}
          />
        ) : (
          <FaRegHeart className="heart-icon" onClick={handleWatchlist} />
        )}
      </div>

      <img src={image} alt="product" className="product-image" />

      <div className="product-info">
        <h3 className="product-name">{productname}</h3>

        <p className="product-description">
          <del>${discountValue}</del> ${actualValue}
        </p>

        <button className="add-to-cart">View Product</button>

        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              style={{ color: i < startValue ? "#ffc107" : "#ccc" }}
            />
          ))}
          <span className="review-count">({reviewsCount})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCards;
