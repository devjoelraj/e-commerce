import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom"; // 👈 new imports
import { FaHeart, FaStar } from "react-icons/fa";
import "./ProductDetails.css";
import Header from "../header/userHeader/Header";
import { getPantsProductByIdService } from "../../api/userServices/productsServices";

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  console.log("Product from location state:", product);
  const [loading, setLoading] = useState(!product);
  const [selectedImg, setSelectedImg] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState("details");

  useEffect(() => {
    if (!product && id) {
      const fetchProduct = async () => {
        try {
          const response = await getPantsProductByIdService(id);
          if (response?.success) {
            setProduct(response.data);
            setSelectedImg(
              response.data.colors?.[0]?.images?.[0]?.imageUrl || "",
            );
          }
        } catch (error) {
          console.error("Failed to fetch product", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else if (product) {
      setSelectedImg(product.colors?.[0]?.images?.[0]?.imageUrl || "");
      setLoading(false);
    }
  }, [product, id]);

  useEffect(() => {
    if (product && product.colors?.[selectedColorIndex]) {
      setSelectedImg(
        product.colors[selectedColorIndex].images?.[0]?.imageUrl || "",
      );
    }
  }, [selectedColorIndex, product]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

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
            {product.colors?.[selectedColorIndex]?.images
              ?.slice(1)
              ?.map((img, index) => (
                <img
                  key={index}
                  src={img.imageUrl}
                  alt={`thumb-${index}`}
                  className="product-details-thumbnail"
                  onClick={() => {
                    setSelectedImg(img.imageUrl);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              ))}
          </div>
        </div>

        <div className="product-details-section">
          <p className="product-details-name">{product.productName}</p>

          <p className="product-details-rating">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                color={i < (product.rating || 4) ? "#ffc107" : "#ccc"}
              />
            ))}
          </p>

          <h1 className="product-details-price">
            ${product.pricing?.discountPrice || product.pricing?.basePrice}
          </h1>

          {product.colors && product.colors.length > 0 && (
            <>
              <p className="product-details-label">Color</p>
              <div className="product-details-color-options">
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className={`product-details-color-circle ${selectedColorIndex === index ? "selected" : ""}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => {
                      setSelectedColorIndex(index);
                      setSelectedImg(color.images?.[0]?.imageUrl || "");
                      setSelectedSize(null);
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </>
          )}

          <p className="product-details-label">Size</p>
          <div className="product-details-size-buttons">
            {product.colors?.[selectedColorIndex]?.sizes
              ?.filter((sizeObj) => sizeObj.qty > 0)
              .map((sizeObj) => (
                <button
                  key={sizeObj.size}
                  className={`product-details-size-btn ${
                    selectedSize === sizeObj.size ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSize(sizeObj.size)}
                >
                  {sizeObj.size}
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
                <strong>Material:</strong> {product.material || "100% Cotton"}
              </p>
              <p>
                <strong>Fit:</strong> {product.fit || "Regular Fit"}
              </p>
              <p>
                <strong>Care:</strong> {product.care || "Machine wash cold"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {product.description || "No description available."}
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
