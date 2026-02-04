import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./UploadProductDetails.css";

const UploadProductDetails = () => {
  const location = useLocation();
  const [colors, setColors] = useState([]);
  const [imagesByColor, setImagesByColor] = useState({});
  const [colorInput, setColorInput] = useState("");

  const handleAddColor = (color) => {
    if (color && !colors.find((c) => c.name === color)) {
      const newColor = { name: color, image: null };
      setColors((prev) => [...prev, newColor]);
      setImagesByColor((prev) => ({ ...prev, [color]: [] }));
    }
  };

  const handleImageChange = (e, colorName) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImagesByColor((prev) => ({
      ...prev,
      [colorName]: [...(prev[colorName] || []), ...newImages].slice(0, 5),
    }));
  };

  const handleRemove = (colorName, index) => {
    setImagesByColor((prev) => ({
      ...prev,
      [colorName]: prev[colorName].filter((_, i) => i !== index),
    }));
  };

  const renderInput = (id, label, type = "text", placeholder = "") => (
    <div className="uploadpage-form-group">
      <label htmlFor={id} className="uploadpage-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="my-input-feild"
        placeholder={placeholder}
      />
    </div>
  );

  const flexRow = (children) => <div className="my-flex-row">{children}</div>;

  return (
    <div>
      {" "}
      <div className="my-page-container">
        <div className="uploadpage-container">
          <h2 className="uploadpage-title">Upload Product Details</h2>

          {renderInput(
            "productName",
            "Product Name",
            "text",
            "Enter product name"
          )}

          <div className="uploadpage-form-group">
            <label htmlFor="productDescription" className="uploadpage-label">
              Description
            </label>
            <textarea
              id="productDescription"
              rows="4"
              className="my-input-feild"
              placeholder="Enter product description"
            ></textarea>
          </div>

          <hr style={{ marginTop: 30 }} />

          {flexRow(
            <>
              {renderInput(
                "basePrice",
                "Base Price",
                "number",
                "Enter base price"
              )}
              {renderInput(
                "discountPercentage",
                "Discount Percentage",
                "number",
                "Enter discount %"
              )}
              {renderInput(
                "Actual Price",
                "Discount Price",
                "number",
                "Enter discounted price"
              )}
            </>
          )}

          <hr />

          <h3 className="uploadpage-section-title" style={{ marginTop: 8 }}>
            Inventory
          </h3>
          {flexRow(
            <>
              {renderInput(
                "productId",
                "Product ID",
                "text",
                "Enter product ID"
              )}
              {renderInput("category", "Category", "text", "Enter category")}
            </>
          )}

          <div className="my-inventory-section">
            <h3 className="uploadpage-section-title">Size</h3>
            {flexRow(
              <>
                {renderInput("stockM", "Stock M", "number", "Enter stock")}
                {renderInput("stockL", "Stock L", "number", "Enter stock")}
              </>
            )}
            {flexRow(
              <>
                {renderInput("stockXL", "Stock XL", "number", "Enter stock")}
                {renderInput("stockXXL", "Stock XXL", "number", "Enter stock")}
              </>
            )}

            <div className="my-total-stock">
              <h4 className="uploadpage-subtitle">Total stock</h4>
              <input
                type="number"
                id="totalStock"
                className="my-input-feild"
                placeholder="Enter the stock according to the size"
              />
            </div>
          </div>
        </div>

        {/* ---------- Right Side Color Section ---------- */}
        <div className="my-color-section">
          <h3>Select color</h3>
          <div className="my-color-input-row">
            <input
              type="text"
              placeholder="Type color name & press Enter"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              className="my-color-input"
            />

            <label className="my-upload-btn">
              Upload
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && colorInput.trim()) {
                    const newColor = {
                      name: colorInput.trim(),
                      image: { file, url: URL.createObjectURL(file) },
                    };
                    setColors((prev) => [...prev, newColor]);
                    setImagesByColor((prev) => ({
                      ...prev,
                      [newColor.name]: [],
                    }));
                    setColorInput("");
                  }
                }}
              />
            </label>

            <button
              className="my-ok-btn"
              onClick={() => {
                handleAddColor(colorInput.trim());
                setColorInput("");
              }}
            >
              OK
            </button>
          </div>

          {/* Color Blocks */}
          {colors.map((color) => (
            <div key={color.name} className="my-color-card">
              <div className="my-color-header">
                <div className="my-color-title">
                  <h4>{color.name}</h4>
                  {color.image && (
                    <img
                      src={color.image.url}
                      alt={color.name}
                      className="my-color-thumbnail"
                    />
                  )}
                </div>

                <button
                  className="my-delete-btn"
                  onClick={() => {
                    setColors((prev) =>
                      prev.filter((c) => c.name !== color.name)
                    );
                    setImagesByColor((prev) => {
                      const newImages = { ...prev };
                      delete newImages[color.name];
                      return newImages;
                    });
                  }}
                >
                  Delete
                </button>
              </div>

              {/* Extra Images */}
              <div className="my-image-list">
                {imagesByColor[color.name]?.map((img, index) => (
                  <div key={index} className="my-image-box">
                    <img src={img.url} alt="preview" className="my-image" />
                    <button
                      className="my-remove-img-btn"
                      onClick={() => handleRemove(color.name, index)}
                    >
                      ×
                    </button>
                  </div>
                ))}

                {imagesByColor[color.name]?.length < 5 && (
                  <label className="my-add-img-box">
                    +
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, color.name)}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: "grey",
          justifyContent: "center",
          padding: 12,
          borderRadius: 24,
          margin: "20px 30px",
        }}
      >
        ADD PRODUCT
      </div>
    </div>
  );
};

export default UploadProductDetails;
