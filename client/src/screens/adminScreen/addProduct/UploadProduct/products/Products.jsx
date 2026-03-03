import React, { useState } from "react";
import UploadAccessiors from "./accessiors/UploadAccessiors";
import UploadPants from "./pants/UploadPants";
import UploadShirts from "./shirts/UploadShirts";
import UploadFootwears from "./footwears/UploadFootwears";
import "./UploadProducts.css";

const UploadProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const renderComponent = () => {
    switch (selectedCategory) {
      case "accessories":
        return <UploadAccessiors />;
      case "pants":
        return <UploadPants />;
      case "shirts":
        return <UploadShirts />;
      case "footwear":
        return <UploadFootwears />;
      default:
        return <p>Please select a category</p>;
    }
  };

  return (
    <div className="upload-products-container">
      <h2 style={{ textAlign: "center" }}>Select Product Category</h2>

      <div className="category-buttons">
        <button onClick={() => setSelectedCategory("shirts")}>Shirts</button>
        <button onClick={() => setSelectedCategory("pants")}>Pants</button>
        <button onClick={() => setSelectedCategory("footwear")}>
          Footwear
        </button>
        <button onClick={() => setSelectedCategory("accessories")}>
          Accessories
        </button>
      </div>

      <h2
        style={{
          textAlign: "center",
          backgroundColor: "#baaaaa",
          padding: "8px 0",
          borderRadius: "8px",
        }}
      >
        {selectedCategory?.toUpperCase()}
      </h2>
      <div className="upload-section">{renderComponent()}</div>
    </div>
  );
};

export default UploadProducts;
