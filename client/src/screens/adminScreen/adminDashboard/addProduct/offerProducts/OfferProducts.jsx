import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import ContinueButton from "../../../../../components/buttons/ContinueButton";
import presentToast from "../../../../../components/Toast/Toast";

const dummyProducts = [
  { id: 1, name: "linen shirts", price: 800 },
  { id: 2, name: "Samsung S23", price: 700 },
  { id: 3, name: "Nike Shoes", price: 120 },
  { id: 4, name: "MacBook Pro", price: 1500 },
];

const OfferProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [offerPrice, setOfferPrice] = useState("");

  const filteredProducts = dummyProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSearchTerm("");
    setOfferPrice("");
  };

  const handleSubmit = () => {
    if (!selectedProduct || !offerPrice) {
      presentToast.error("Please select product and enter offer price");
      return;
    }

    console.log("Offer Data:", {
      productId: selectedProduct.id,
      actualPrice: selectedProduct.price,
      offerPrice: offerPrice,
    });

    presentToast.success("Offer added successfully!");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <div className="search-wrapper" style={{ position: "relative" }}>
        <input
          type="text"
          name="search"
          placeholder="Search for products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{ width: "100%", padding: "10px 40px 10px 10px" }}
        />
        <FaSearch
          className="search-icon"
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
      </div>

      {searchTerm && (
        <div
          style={{
            border: "1px solid #ddd",
            marginTop: "5px",
            borderRadius: "5px",
          }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                {product.name} - ${product.price}
              </div>
            ))
          ) : (
            <div style={{ padding: "10px" }}>No products found</div>
          )}
        </div>
      )}

      {selectedProduct && (
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 style={{ margin: "10px 0" }}>Selected Product</h3>

          <div style={{ marginBottom: "10px" }}>
            <label>Product Name</label>
            <input
              type="text"
              value={selectedProduct.name}
              readOnly
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Actual Price</label>
            <input
              type="text"
              value={selectedProduct.price}
              readOnly
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Offer Price</label>
            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              placeholder="Enter offer price"
              style={{
                width: "100%",
                padding: "8px",
                border: "2px solid #8864f0",
                borderRadius: "8px",
              }}
            />
          </div>

          <ContinueButton
            onClick={handleSubmit}
            text="  Add Offer"
            style={{ padding: "10px 15px" }}
          />
        </div>
      )}
    </div>
  );
};

export default OfferProducts;
