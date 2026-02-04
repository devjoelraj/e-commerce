import React, { useState } from "react";
import { FaHeart, FaStar } from "react-icons/fa";
import "./ProductDetails.css";
import Header from "../header/userHeader/Header";

const ProductDetails = () => {
  const data = [
    {
      id: 1,
      name: "Classic Cotton Shirt",
      price: 109,
      category: "men",
      images: [
        "https://picsum.photos/id/1011/600/400",
        "https://picsum.photos/id/1012/600/400",
        "https://picsum.photos/id/1013/600/400",
        "https://picsum.photos/id/1014/600/400",
      ],
      colors: [
        "https://picsum.photos/seed/red/50",
        "https://picsum.photos/seed/blue/50",
        "https://picsum.photos/seed/black/50",
      ],
    },
  ];

  const product = data[0];
  const [selectedImg, setSelectedImg] = useState(data[0].images[0]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedTab, setSelectedTab] = useState("details");
  return (
    <>
      <Header />
      <div className="product-details-container">
        <div className="product-details-images-section">
          <img
            src={selectedImg}
            alt="Main"
            className="product-details-main-image"
          />
          <div className="product-details-thumbnail-row">
            {product.images?.slice(1)?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`thumb-${index}`}
                className="product-details-thumbnail"
                onClick={() => {
                  setSelectedImg(img);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            ))}
          </div>
        </div>

        <div className="product-details-section">
          <p className="product-details-name">{product.name}</p>

          <p className="product-details-rating">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </p>

          <h1 className="product-details-price">Rate: ${product.price}</h1>

          <p className="product-details-label">Color</p>
          <div className="product-details-color-options">
            {product.colors?.map((colorImg, index) => (
              <img
                key={index}
                src={colorImg}
                alt={`color-${index}`}
                className="product-details-color-circle"
              />
            ))}
          </div>

          <p className="product-details-label">Size</p>
          <div className="product-details-size-buttons">
            {["XS", "S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                className={`product-details-size-btn ${
                  selectedSize === size ? "selected" : ""
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="product-details-actions">
            <button className="product-details-add-to-cart">Add to cart</button>
            <FaHeart className="product-details-wishlist-icon" />
          </div>

          <p className="product-details-delivery-info">🚚 Free delivery</p>
        </div>
      </div>

      <div className="product-tabs-container">
        <div className="product-tabs-header">
          <p
            className={`product-tab-button ${
              selectedTab === "details" ? "active-tab" : ""
            }`}
            onClick={() => setSelectedTab("details")}
          >
            Details
          </p>

          <p
            className={`product-tab-button ${
              selectedTab === "reviews" ? "active-tab" : ""
            }`}
            onClick={() => setSelectedTab("reviews")}
          >
            Reviews
          </p>
        </div>

        <div className="product-tab-content">
          {selectedTab === "details" ? (
            <div className="product-details-content">
              <p>
                <strong>Material:</strong> 100% Premium Cotton
              </p>
              <p>
                <strong>Fit:</strong> Regular Fit
              </p>
              <p>
                <strong>Care:</strong> Machine wash cold, tumble dry low
              </p>
              <p>
                <strong>Description:</strong> This classic cotton shirt is
                perfect for everyday wear. It’s soft, breathable, and designed
                to keep you comfortable while looking sharp.
              </p>
            </div>
          ) : (
            <div className="product-reviews-content">
              <p>No reviews yet. Be the first to leave one!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
