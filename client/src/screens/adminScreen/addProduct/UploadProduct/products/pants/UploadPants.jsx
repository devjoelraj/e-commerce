import React, { useEffect, useState } from "react";
import "./UploadPants.css";
import {
  postPantsProductService,
  addExistingPantsVariantService,
} from "../../../../../../api/adminServices/addProductService";
import { getPantsProductsService } from "../../../../../../api/userServices/productsServices";
import { message } from "antd";

const SIZE_LIST = [30, 32, 34, 36, 38, 40];

const INITIAL_SIZES = SIZE_LIST.reduce((acc, size) => {
  acc[size] = "";
  return acc;
}, {});

const UploadPants = () => {
  const [productType, setProductType] = useState("new");

  const [existingProducts, setExistingProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");

  const [sizes, setSizes] = useState(INITIAL_SIZES);

  const [colors, setColors] = useState([]);
  const [imagesByColor, setImagesByColor] = useState({});

  const [colorInput, setColorInput] = useState("");
  const [colorHex, setColorHex] = useState("#000000");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getPantsProductsService();
        console.log(response, "es");
        if (response?.success) {
          setExistingProducts(response.products);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [productType]);

  const handleAddColor = () => {
    if (!colorInput.trim()) return;

    const newColor = {
      name: colorInput.trim(),
      hex: colorHex,
    };

    setColors([newColor]);
    setImagesByColor({ [newColor.name]: [] });
    setColorInput("");
  };

  const handleImageChange = (e, colorName) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImagesByColor((prev) => ({
      ...prev,
      [colorName]: [...(prev[colorName] || []), ...newImages],
    }));
  };

  const handleRemoveImage = (colorName, index) => {
    setImagesByColor((prev) => ({
      ...prev,
      [colorName]: prev[colorName].filter((_, i) => i !== index),
    }));
  };

  const handleSumbit = async () => {
    if (productType === "existing" && !selectedProductId)
      return message.error("Select product");

    if (productType === "new") {
      if (!productName.trim()) return message.error("Product name is required");

      if (!description.trim()) return message.error("Description is required");

      if (!basePrice || !discountPrice)
        return message.error("Prices are required");
    }

    if (!colors.length) return message.error("Color is required");

    const selectedColor = colors[0];

    if (!imagesByColor[selectedColor.name]?.length) {
      return message.error("At least one image is required");
    }

    const sizesObj = Object.fromEntries(
      Object.entries(sizes).map(([size, qty]) => [size, Number(qty) || 0]),
    );

    if (Object.values(sizesObj).every((q) => q === 0)) {
      return message.error("At least one size must have quantity");
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
      } else {
        formData.append("productId", selectedProductId);
      }

      const colorsWithSizes = [
        {
          name: selectedColor.name,
          hex: selectedColor.hex,
          sizes: sizesObj,
        },
      ];

      formData.append("colors", JSON.stringify(colorsWithSizes));

      imagesByColor[selectedColor.name].forEach((img) =>
        formData.append("file", img.file),
      );

      let response;

      if (productType === "new") {
        response = await postPantsProductService(formData);
      } else {
        response = await addExistingPantsVariantService(
          selectedProductId,
          formData,
        );
      }

      if (response?.success) {
        message.success("Product uploaded successfully!");

        setProductName("");
        setDescription("");
        setBasePrice("");
        setDiscountPercentage("");
        setDiscountPrice("");
        setSizes(INITIAL_SIZES);
        setColors([]);
        setImagesByColor({});
        setSelectedProductId("");
      } else {
        message.error(response?.message || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      message.error("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  // -------- REUSABLE INPUT --------
  const renderInput = (
    id,
    label,
    type = "text",
    placeholder = "",
    value = "",
    onChange = () => {},
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
    <div>
      <div className="my-page-container">
        {/* LEFT SIDE */}
        <div className="uploadpage-container">
          <h2 className="uploadpage-title">Upload Product Details</h2>

          {/* PRODUCT TYPE */}
          <div className="my-flex-row">
            <label>
              <input
                type="radio"
                checked={productType === "new"}
                onChange={() => setProductType("new")}
              />
              New
            </label>

            <label>
              <input
                type="radio"
                checked={productType === "existing"}
                onChange={() => setProductType("existing")}
              />
              Existing
            </label>
          </div>

          {/* EXISTING PRODUCT SELECT */}
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

          {/* NEW PRODUCT ONLY */}
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

          {/* SIZES */}
          <div className="pants-size-grid">
            {SIZE_LIST.map((size) => (
              <div key={size} className="pants-size-card">
                <label>{size}</label>

                <input
                  type="number"
                  placeholder="Qty"
                  className="pants-size-input"
                  value={sizes[size]}
                  onChange={(e) =>
                    setSizes((prev) => ({
                      ...prev,
                      [size]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
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
              style={{ width: 50, height: 40, border: "none" }}
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

                <label className="my-add-img-box">
                  +
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageChange(e, color.name)}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUBMIT */}
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
        onClick={() => !loading && handleSumbit()}
      >
        {loading ? "UPLOADING..." : "ADD PRODUCT"}
      </div>
    </div>
  );
};

export default UploadPants;
