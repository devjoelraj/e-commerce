import React, { useState } from "react";

const UploadAccessiors = () => {
  const [colors, setColors] = useState([]);
  const [imagesByColor, setImagesByColor] = useState({});
  const [colorInput, setColorInput] = useState("");
  const [colorHex, setColorHex] = useState("#000000");
  const [productType, setProductType] = useState("chain");

  const handleAddColor = () => {
    if (!colorInput.trim()) return;
    if (colors.find((c) => c.name === colorInput.trim())) return;
    const newColor = {
      name: colorInput.trim(),
      hex: colorHex,
    };
    setColors((prev) => [...prev, newColor]);
    setImagesByColor((prev) => ({
      ...prev,
      [newColor.name]: [],
    }));

    setColorInput("");
    setColorHex("#000000");
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

  // ---------- REMOVE IMAGE ----------
  const handleRemoveImage = (colorName, index) => {
    setImagesByColor((prev) => ({
      ...prev,
      [colorName]: prev[colorName].filter((_, i) => i !== index),
    }));
  };

  // ---------- REMOVE COLOR ----------
  const handleRemoveColor = (colorName) => {
    setColors((prev) => prev.filter((c) => c.name !== colorName));

    setImagesByColor((prev) => {
      const updated = { ...prev };
      delete updated[colorName];
      return updated;
    });
  };

  // ---------- REUSABLE INPUT ----------
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
      <div className="my-page-container">
        {/* ---------------- LEFT SIDE ---------------- */}
        <div className="uploadpage-container">
          <h2 className="uploadpage-title">Upload Product Details</h2>

          {renderInput(
            "productName",
            "Product Name",
            "text",
            "Enter product name",
          )}

          <div className="uploadpage-form-group">
            <label className="uploadpage-label">Description</label>
            <textarea
              rows="4"
              className="my-input-feild"
              placeholder="Enter product description"
            />
          </div>

          <hr style={{ marginTop: 30 }} />
          <h3 style={{ textAlign: "center", margin: "4px 0" }}>Price</h3>
          {flexRow(
            <>
              {renderInput(
                "basePrice",
                "Base Price",
                "number",
                "Enter base price",
              )}
              {renderInput(
                "discountPercentage",
                "Discount %",
                "number",
                "Enter discount %",
              )}
              {renderInput(
                "discountPrice",
                "Discount Price",
                "number",
                "Enter discounted price",
              )}
            </>,
          )}

          <hr />
          <h3 className="uploadpage-section-title" style={{ marginTop: 8 }}>
            Inventory
          </h3>
          <div className="uploadpage-form-group">
            <label className="uploadpage-label" style={{ marginTop: "4px" }}>
              Product Type
            </label>
            <select
              className="my-input-feild"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
            >
              <option value="chain">Chain</option>
              <option value="ring">Ring</option>
              <option value="watch">Watch</option>
            </select>
          </div>
        </div>

        {/* ---------------- RIGHT SIDE (COLOR SECTION) ---------------- */}
        <div className="my-color-section">
          <h3>Select Color</h3>

          <div className="my-color-input-row">
            <input
              type="text"
              placeholder="Color name"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              className="my-color-input"
            />

            <input
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              style={{
                width: 50,
                height: 40,
                border: "none",
                cursor: "pointer",
              }}
            />

            <button className="my-ok-btn" onClick={handleAddColor}>
              Add
            </button>
          </div>

          {/* ----------- COLOR CARDS ----------- */}
          {colors.map((color) => (
            <div key={color.name} className="my-color-card">
              <div className="my-color-header">
                <div className="my-color-title">
                  <h4>{color.name}</h4>

                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      backgroundColor: color.hex,
                      border: "2px solid #ddd",
                    }}
                  />
                </div>

                <button
                  className="my-delete-btn"
                  onClick={() => handleRemoveColor(color.name)}
                >
                  Delete
                </button>
              </div>

              {/* ----------- IMAGES PER COLOR ----------- */}
              <div className="my-image-list">
                {imagesByColor[color.name]?.map((img, index) => (
                  <div key={index} className="my-image-box">
                    <img src={img.url} alt="preview" className="my-image" />
                    <button
                      className="my-remove-img-btn"
                      onClick={() => handleRemoveImage(color.name, index)}
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

        {/* ---------------- SUBMIT BUTTON ---------------- */}
      </div>
      <div
        style={{
          textAlign: "center",
          backgroundColor: "grey",
          padding: 12,
          borderRadius: 24,
          margin: "20px 30px",
          cursor: "pointer",
        }}
      >
        ADD PRODUCT
      </div>
    </div>
  );
};

export default UploadAccessiors;
