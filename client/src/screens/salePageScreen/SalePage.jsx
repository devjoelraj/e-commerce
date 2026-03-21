import React, { useState } from "react";
import presentToast from "../../components/Toast/Toast";
import { getAllProductService } from "../../api/adminServices/allProductService";
import { reduceStock } from "../../api/adminServices/salePageService";
import "./ReduceStock.css";

const categories = ["Shirts", "Pants", "Footwear", "Accessories"];

const ReduceStock = () => {
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sellingPrice, setSellingPrice] = useState(""); // new state
  const [loading, setLoading] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState(false);

  const fetchProducts = async (cat) => {
    if (!cat) return;
    setFetchingProducts(true);
    setProducts([]);
    setSelectedProduct(null);
    setColor("");
    setSize("");
    setSellingPrice(""); // reset
    try {
      const res = await getAllProductService();
      if (res.success) {
        const filtered = res.data.filter(
          (p) => p.category.toLowerCase() === cat.toLowerCase(),
        );
        setProducts(filtered);
      } else {
        presentToast.error(res.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error(error);
      presentToast.error("Error fetching products");
    } finally {
      setFetchingProducts(false);
    }
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setCategory(cat);
    if (cat) fetchProducts(cat);
  };

  const handleProductSelect = (e) => {
    const id = e.target.value;
    const prod = products.find((p) => p._id === id);
    setSelectedProduct(prod);
    setColor("");
    setSize("");
    setSellingPrice("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !color || !quantity || quantity <= 0) {
      presentToast.error("Please fill all fields");
      return;
    }
    if (category !== "Accessories" && !size) {
      presentToast.error("Please select a size");
      return;
    }
    setLoading(true);
    const payload = {
      productId: selectedProduct._id,
      category,
      color,
      size: category !== "Accessories" ? size : undefined,
      quantity,
    };
    // Add sellingPrice if provided and valid number
    if (
      sellingPrice &&
      !isNaN(parseFloat(sellingPrice)) &&
      parseFloat(sellingPrice) > 0
    ) {
      payload.sellingPrice = parseFloat(sellingPrice);
    }
    const res = await reduceStock(payload);
    if (res.success) {
      presentToast.success("Stock reduced successfully");
      await fetchProducts(category);
    } else {
      presentToast.error(res.message || "Failed to reduce stock");
    }
    setLoading(false);
  };

  return (
    <div className="sale-container">
      <h2 className="sale-title">Reduce Stock (Offline Sale)</h2>
      <form onSubmit={handleSubmit} className="sale-form">
        {/* Category Selection */}
        <div className="sale-form-group">
          <label>Category</label>
          <select
            className="sale-select"
            value={category}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Product Selection */}
        {category && (
          <div className="sale-form-group">
            <label>Product</label>
            {fetchingProducts ? (
              <div className="sale-loading-placeholder">
                Loading products...
              </div>
            ) : (
              <>
                <select
                  className="sale-select"
                  value={selectedProduct?._id || ""}
                  onChange={handleProductSelect}
                  required
                  disabled={products.length === 0}
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.productName}
                    </option>
                  ))}
                </select>
                {products.length === 0 && !fetchingProducts && (
                  <p className="sale-info-message">
                    No products found in this category.
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Color Selection */}
        {selectedProduct && (
          <div className="sale-form-group">
            <label>Color</label>
            <select
              className="sale-select"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            >
              <option value="">Select color</option>
              {selectedProduct.colors.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} (stock:{" "}
                  {category === "Accessories"
                    ? c.qty
                    : c.sizes?.reduce((sum, s) => sum + s.qty, 0) || 0}
                  )
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Size Selection */}
        {selectedProduct && category !== "Accessories" && color && (
          <div className="sale-form-group">
            <label>Size</label>
            <select
              className="sale-select"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
            >
              <option value="">Select size</option>
              {selectedProduct.colors
                .find((c) => c.name === color)
                ?.sizes?.map((s) => (
                  <option key={s.size} value={s.size}>
                    {s.size} (stock: {s.qty})
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Quantity Input */}
        {selectedProduct && (
          <div className="sale-form-group">
            <label>Quantity to deduct</label>
            <input
              className="sale-input"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              required
            />
          </div>
        )}

        {/* Selling Price Input (optional) */}
        {selectedProduct && (
          <div className="sale-form-group">
            <label>Selling Price (optional)</label>
            <input
              className="sale-input"
              type="number"
              min="0"
              step="0.01"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              placeholder="Leave empty to use product price"
            />
          </div>
        )}

        {selectedProduct && (
          <button type="submit" className="sale-submit-btn" disabled={loading}>
            {loading ? "Processing..." : "Reduce Stock"}
          </button>
        )}
      </form>
    </div>
  );
};

export default ReduceStock;
