import React, { useState, useEffect } from "react";

import {
  postAccessoriesProductService,
  addExistingAccessoriesVariantService,
} from "../../../../../../api/adminServices/addProductService";
import presentToast from "../../../../../../components/Toast/Toast";
import { getAccessoriesProductsService } from "../../../../../../api/userServices/productsServices";

const UploadAccessories = () => {
  const [productType, setProductType] = useState("new");

  const [existingProducts, setExistingProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");

  const [accessoryType, setAccessoryType] = useState("chain");
  const [qty, setQty] = useState("");
  const [colors, setColors] = useState([]);
  const [imagesByColor, setImagesByColor] = useState({});
  const [colorInput, setColorInput] = useState("");
  const [colorHex, setColorHex] = useState("#000000");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productType === "existing") {
      const fetchProducts = async () => {
        try {
          const response = await getAccessoriesProductsService();
          if (response?.success) {
            setExistingProducts(response.data || []);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchProducts();
    }
  }, [productType]);

  const handleAddColor = () => {
    if (!colorInput.trim()) {
      presentToast.error("Please enter a color name");
      return;
    }
    if (!qty) {
      presentToast.error("Please enter quantity");
      return;
    }

    const newColor = {
      name: colorInput.trim(),
      hex: colorHex,
      qty: Number(qty) || 0,
    };
    setColors([newColor]);
    setImagesByColor({ [newColor.name]: [] });
    setColorInput("");
    setColorHex("#000000");
    setQty("");
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

  const handleRemoveImage = (colorName, index) => {
    setImagesByColor((prev) => ({
      ...prev,
      [colorName]: prev[colorName].filter((_, i) => i !== index),
    }));
  };

  const handleRemoveColor = (colorName) => {
    setColors([]);
    setImagesByColor({});
  };

  const handleSubmit = async () => {
    if (productType === "existing" && !selectedProductId) {
      return presentToast.error("Please select an existing product");
    }

    if (productType === "new") {
      if (!productName.trim())
        return presentToast.error("Product name is required");
      if (!description.trim())
        return presentToast.error("Description is required");
      if (!basePrice || !discountPrice)
        return presentToast.error("Prices are required");
    }

    if (colors.length === 0) {
      return presentToast.error("At least one color is required");
    }

    const selectedColor = colors[0];

    if (!imagesByColor[selectedColor.name]?.length) {
      return presentToast.error("At least one image is required for the color");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      if (productType === "new") {
        formData.append("productName", productName);
        formData.append("description", description);
        formData.append("basePrice", basePrice);
        formData.append("discountPercentage", discountPercentage || 0);
        formData.append("discountPrice", discountPrice);
        formData.append("type", accessoryType);
      }

      const colorsWithSizes = [
        {
          name: selectedColor.name,
          hex: selectedColor.hex,
          qty: selectedColor.qty,
        },
      ];

      formData.append("colors", JSON.stringify(colorsWithSizes));

      imagesByColor[selectedColor.name].forEach((img) => {
        formData.append("file", img.file);
      });

      let response;

      if (productType === "new") {
        response = await postAccessoriesProductService(formData);
        console.log(response, "res");
      } else {
        response = await addExistingAccessoriesVariantService(
          selectedProductId,
          formData,
        );
        console.log(response, "res variant");
      }

      if (response?.success) {
        presentToast.success("Product uploaded successfully!");

        setProductName("");
        setDescription("");
        setBasePrice("");
        setDiscountPercentage("");
        setDiscountPrice("");
        setColors([]);
        setImagesByColor({});
        setSelectedProductId("");
        setAccessoryType("chain");
      } else {
        presentToast.error(response?.message || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      presentToast.error("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  // Reusable input component
  const renderInput = (
    id,
    label,
    type = "text",
    placeholder = "",
    value,
    onChange,
  ) => (
    <div className="uploadpage-form-group">
      <label htmlFor={id} className="uploadpage-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="my-input-feild"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );

  const flexRow = (children) => <div className="my-flex-row">{children}</div>;

  return (
    <>
      <div className="my-page-container">
        {/* LEFT SIDE */}
        <div className="uploadpage-container">
          <h2 className="uploadpage-title">Upload Accessories Product</h2>

          {/* New / Existing Toggle */}
          <div className="my-flex-row">
            <label>
              <input
                type="radio"
                checked={productType === "new"}
                onChange={() => setProductType("new")}
              />
              New Product
            </label>
            <label style={{ marginLeft: 20 }}>
              <input
                type="radio"
                checked={productType === "existing"}
                onChange={() => setProductType("existing")}
              />
              Add Variant to Existing
            </label>
          </div>

          {/* Existing Product Dropdown */}
          {productType === "existing" && (
            <div className="uploadpage-form-group">
              <label className="uploadpage-label">Select Product</label>
              <select
                className="my-input-feild"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">Select product</option>
                {existingProducts.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.productName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* New Product Fields */}
          {productType === "new" && (
            <>
              {renderInput(
                "productName",
                "Product Name",
                "text",
                "Enter product name",
                productName,
                (e) => setProductName(e.target.value),
              )}

              <div className="uploadpage-form-group">
                <label className="uploadpage-label">Description</label>
                <textarea
                  rows="4"
                  className="my-input-feild"
                  placeholder="Enter product description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                    basePrice,
                    (e) => setBasePrice(e.target.value),
                  )}
                  {renderInput(
                    "discountPercentage",
                    "Discount %",
                    "number",
                    "Enter discount %",
                    discountPercentage,
                    (e) => setDiscountPercentage(e.target.value),
                  )}
                  {renderInput(
                    "discountPrice",
                    "Discount Price",
                    "number",
                    "Enter discounted price",
                    discountPrice,
                    (e) => setDiscountPrice(e.target.value),
                  )}
                </>,
              )}
            </>
          )}

          <hr />

          {/* Inventory Section – only for new products */}
          {productType === "new" && (
            <div className="my-inventory-section">
              <h3 className="uploadpage-section-title">Product Type</h3>
              <div className="uploadpage-form-group">
                <label className="uploadpage-label">Select Type</label>
                <select
                  className="my-input-feild"
                  value={accessoryType}
                  onChange={(e) => setAccessoryType(e.target.value)}
                >
                  <option value="chain">Chain</option>
                  <option value="ring">Ring</option>
                  <option value="watch">Watch</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE - COLORS */}
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
              type="number"
              placeholder="Qty"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="my-color-input"
              style={{ width: 100 }}
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
              <div className="my-color-title">
                <h4>{color.name}</h4>
                <p>Qty: {color.qty}</p>
              </div>
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
      </div>

      {/* SUBMIT BUTTON */}
      <div
        style={{
          textAlign: "center",
          backgroundColor: loading ? "#999" : "grey",
          padding: 12,
          borderRadius: 24,
          margin: "20px 30px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
        onClick={() => !loading && handleSubmit()}
      >
        {loading ? "UPLOADING..." : "ADD PRODUCT"}
      </div>
    </>
  );
};

export default UploadAccessories;
