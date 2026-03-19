import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./ProductDetails.css";
import Header from "../header/userHeader/Header";

import { getPantsProductByIdService } from "../../api/userServices/productsServices";
import {
  getAccessoriesProductByIdService,
  getFootwearProductByIdService,
  getShirtsProductByIdService,
} from "../../api/userServices/userDashboard";

import presentToast from "../Toast/Toast";
import DetailSkeleton from "../loading/detailSkeletion";
import { addToCartService } from "../../api/userServices/addToCartService";

const ProductDetails = () => {
  const { category, id } = useParams(); // 👈 now category is captured
  const location = useLocation();

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);

  const [selectedImg, setSelectedImg] = useState("");
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedTab, setSelectedTab] = useState("details");

  const [imageLoading, setImageLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  /* 🔁 SERVICE MAP */
  const serviceMap = {
    pants: getPantsProductByIdService,
    shirts: getShirtsProductByIdService,
    footwear: getFootwearProductByIdService,
    accessories: getAccessoriesProductByIdService,
  };

  /* 🔄 FETCH PRODUCT */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id || !category || !serviceMap[category]) return;

        const response = await serviceMap[category](id);
        console.log("📦 Product API response:", response);

        if (response?.success && response.data) {
          // Add category to product object (useful later)
          const productWithCategory = {
            ...response.data,
            category: category,
          };
          setProduct(productWithCategory);

          const firstImage =
            response.data.colors?.[0]?.images?.[0]?.imageUrl || "";
          setSelectedImg(firstImage);
        }
      } catch (error) {
        console.error("❌ Fetch product error:", error);
        presentToast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (!product) {
      fetchProduct();
    } else {
      const firstImage = product.colors?.[0]?.images?.[0]?.imageUrl || "";
      setSelectedImg(firstImage);
      setLoading(false);
    }
  }, [id, category, product]);

  /* 🎨 IMAGE CHANGE ON COLOR CHANGE */
  useEffect(() => {
    if (!product) return;

    const color = product.colors?.[selectedColorIndex];
    const newImage = color?.images?.[0]?.imageUrl || "";

    setImageLoading(true);
    setSelectedImg(newImage);
    setSelectedSize(null); // reset size
  }, [selectedColorIndex, product]);

  /* 🛒 ADD TO CART */
  const handleAddToCart = async () => {
    if (cartLoading) return;

    const selectedColor = product?.colors?.[selectedColorIndex];

    console.log("🛒 ADD TO CART CLICKED");
    console.log("🌐 URL category:", category);
    console.log("📦 Product:", product);
    console.log("🎨 Selected Color:", selectedColor);
    console.log("📏 Selected Size:", selectedSize);

    if (!product?._id) {
      return presentToast.error("Product not found");
    }

    if (!selectedColor) {
      return presentToast.error("Please select color");
    }

    if (category !== "accessories" && !selectedSize) {
      return presentToast.error("Please select size");
    }

    // Format category (capitalize first letter)
    const formattedCategory =
      category.charAt(0).toUpperCase() + category.slice(1);

    const payload = {
      productId: product._id,
      category: formattedCategory,
      color: selectedColor.name,
      size: selectedSize,
      quantity: 1,
    };

    console.log("📦 Final Payload:", payload);

    try {
      setCartLoading(true);
      const res = await addToCartService(payload);
      if (res?.success) {
        presentToast.success("Added to cart 🛒");
      } else {
        presentToast.error(res.message || "Failed to add");
      }
    } catch (error) {
      presentToast.error(
        error.response?.data?.message || "Something went wrong",
      );
    } finally {
      setCartLoading(false);
    }
  };

  /* 🧱 LOADING STATES */
  if (loading) return <DetailSkeleton />;
  if (!product) return <div>Product not found</div>;

  return (
    <>
      <Header />
      <div className="product-details-container">
        {/* LEFT */}
        <div className="product-details-images-section">
          <div className="product-details-main-image-wrapper">
            {imageLoading && (
              <div className="product-image-loader">
                <div className="product-image-skeleton"></div>
              </div>
            )}
            <img
              src={selectedImg}
              alt="Main"
              className={`product-details-main-image ${
                imageLoading ? "hidden-image" : "show-image"
              }`}
              onLoad={() => setImageLoading(false)}
            />
          </div>
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
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="product-details-section">
          <p className="product-details-name">{product.productName}</p>

          <h1 className="product-details-price">
            ₹
            {product.pricing?.discountPrice ||
              product.pricing?.basePrice ||
              "N/A"}
          </h1>

          {/* COLOR */}
          <p className="product-details-label">Color</p>
          <div className="product-details-color-options">
            {product.colors?.map((color, index) => (
              <div
                key={index}
                className={`product-details-color-circle ${
                  selectedColorIndex === index ? "selected" : ""
                }`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setSelectedColorIndex(index)}
              />
            ))}
          </div>

          {/* SIZE */}
          {category !== "accessories" && (
            <>
              <p className="product-details-label">Size</p>
              <div className="product-details-size-buttons">
                {product.colors?.[selectedColorIndex]?.sizes
                  ?.filter((s) => s.qty > 0)
                  ?.map((sizeObj) => (
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

          {/* ACTION */}
          <div className="product-details-actions">
            <button
              className="product-details-add-to-cart"
              onClick={handleAddToCart}
              disabled={cartLoading}
              style={{
                opacity: cartLoading ? 0.6 : 1,
                cursor: cartLoading ? "not-allowed" : "pointer",
              }}
            >
              {cartLoading ? "Adding..." : "Add to cart"}
            </button>
          </div>

          <p className="product-details-delivery-info">🚚 Free delivery</p>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
