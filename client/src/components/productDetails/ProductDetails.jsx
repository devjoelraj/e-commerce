import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FaHeart, FaStar } from "react-icons/fa";
import "./ProductDetails.css";
import Header from "../header/userHeader/Header";
import { getPantsProductByIdService } from "../../api/userServices/productsServices";
import {
  getAccessoriesProductByIdService,
  getFootwearProductByIdService,
  getShirtsProductByIdService,
} from "../../api/userServices/userDashboard";
import DetailSkeleton from "../loading/detailSkeletion";

const ProductDetails = () => {
  const { category, id } = useParams();
  const location = useLocation();

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);

  const [selectedImg, setSelectedImg] = useState("");
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedTab, setSelectedTab] = useState("details");

  const [imageLoading, setImageLoading] = useState(true);

  const serviceMap = {
    pants: getPantsProductByIdService,
    shirts: getShirtsProductByIdService,
    footwear: getFootwearProductByIdService,
    accessories: getAccessoriesProductByIdService,
  };

  /* Fetch Product */
  useEffect(() => {
    if (!product && id && category && serviceMap[category]) {
      const fetchProduct = async () => {
        try {
          const response = await serviceMap[category](id);

          if (response?.success) {
            setProduct(response.data);

            const firstImage =
              response.data.colors?.[0]?.images?.[0]?.imageUrl || "";

            setSelectedImg(firstImage);
          }
        } catch (error) {
          console.error("Failed to fetch product", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    } else if (product) {
      const firstImage = product.colors?.[0]?.images?.[0]?.imageUrl || "";
      setSelectedImg(firstImage);
      setLoading(false);
    }
  }, [product, id, category]);

  /* Change image when color changes */
  useEffect(() => {
    if (product && product.colors?.[selectedColorIndex]) {
      const newImage =
        product.colors[selectedColorIndex].images?.[0]?.imageUrl || "";

      setImageLoading(true);
      setSelectedImg(newImage);
    }
  }, [selectedColorIndex, product]);

  if (loading) return <DetailSkeleton />;
  if (!product) return <div>Product not found</div>;

  return (
    <>
      <Header />

      <div className="product-details-container">
        {/* LEFT SIDE IMAGES */}
        <div className="product-details-images-section">
          {/* MAIN IMAGE */}
          <div className="product-details-main-image-wrapper">
            {imageLoading && (
              <div className="product-image-loader">
                <div className="product-image-skeleton"></div>
              </div>
            )}

            <img
              key={selectedImg}
              src={selectedImg}
              alt="Main"
              className={`product-details-main-image ${
                imageLoading ? "hidden-image" : "show-image"
              }`}
              onLoad={() => setImageLoading(false)}
            />
          </div>

          {/* THUMBNAILS */}
          <div className="product-details-thumbnail-row">
            {product.colors?.[selectedColorIndex]?.images?.map((img, index) => (
              <img
                key={index}
                src={img.imageUrl}
                alt="thumbnail"
                className="product-details-thumbnail"
                onClick={() => {
                  setImageLoading(true);
                  setSelectedImg(img.imageUrl);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE DETAILS */}
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
            ₹{product.pricing?.discountPrice || product.pricing?.basePrice}
          </h1>

          {/* COLOR OPTIONS */}
          {product.colors?.length > 0 && (
            <>
              <p className="product-details-label">Color</p>

              <div className="product-details-color-options">
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className={`product-details-color-circle ${
                      selectedColorIndex === index ? "selected" : ""
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => {
                      setSelectedColorIndex(index);
                      setSelectedSize(null);
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </>
          )}

          {/* SIZE OPTIONS */}
          {product.colors?.[selectedColorIndex]?.sizes?.length > 0 && (
            <>
              <p className="product-details-label">Size</p>

              <div className="product-details-size-buttons">
                {product.colors[selectedColorIndex].sizes
                  .filter((size) => size.qty > 0)
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
            </>
          )}

          {/* ACTION BUTTONS */}
          <div className="product-details-actions">
            <button className="product-details-add-to-cart">Add to cart</button>

            <FaHeart className="product-details-wishlist-icon" />
          </div>

          <p className="product-details-delivery-info">🚚 Free delivery</p>
        </div>
      </div>

      {/* PRODUCT TABS */}
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
                <strong>Description:</strong>{" "}
                {product.description || "No description available."}
              </p>
            </div>
          ) : (
            <div className="product-reviews-content">
              <p>No reviews yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
