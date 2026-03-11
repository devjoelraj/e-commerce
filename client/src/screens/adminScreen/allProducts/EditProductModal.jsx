import React, { useState, useEffect } from "react";
import ContinueButton from ".././../../components/buttons/ContinueButton";
import "./EditProductModal.css";
const EditProductModal = ({ open, product, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData(JSON.parse(JSON.stringify(product)));
    }
  }, [product]);

  if (!open || !formData) return null;

  const calculateTotalQty = (colors) => {
    if (formData.category === "accessories") {
      return colors.reduce((sum, c) => sum + (c.qty || 0), 0);
    }

    return colors.reduce(
      (sum, color) =>
        sum + color.sizes.reduce((s, size) => s + (size.qty || 0), 0),
      0,
    );
  };

  const updateQty = (colorIndex, sizeIndex, value) => {
    const updated = { ...formData };

    updated.colors[colorIndex].sizes[sizeIndex].qty = Number(value);

    updated.totalQuantity = calculateTotalQty(updated.colors);

    setFormData(updated);
  };

  const updateAccessoryQty = (colorIndex, value) => {
    const updated = { ...formData };

    updated.colors[colorIndex].qty = Number(value);

    updated.totalQuantity = calculateTotalQty(updated.colors);

    setFormData(updated);
  };

  const updatePrice = (field, value) => {
    setFormData({
      ...formData,
      pricing: {
        ...formData.pricing,
        [field]: Number(value),
      },
    });
  };

  return (
    <div className="modal-overlay">
      <div className="edit-modal">
        <h3>Edit {formData.productName}</h3>

        {/* PRICE */}
        <div className="price-section">
          <label>Base Price</label>
          <input
            type="number"
            value={formData.pricing.basePrice}
            onChange={(e) => updatePrice("basePrice", e.target.value)}
          />

          <label>Discount %</label>
          <input
            type="number"
            value={formData.pricing.discountPercentage}
            onChange={(e) => updatePrice("discountPercentage", e.target.value)}
          />

          <label>Discount Price</label>
          <input
            type="number"
            value={formData.pricing.discountPrice}
            onChange={(e) => updatePrice("discountPrice", e.target.value)}
          />
        </div>

        {/* COLORS */}
        {formData.colors.map((color, colorIndex) => (
          <div key={color._id} className="color-block">
            <h4>{color.name}</h4>

            {formData.category === "accessories" ? (
              <input
                type="number"
                value={color.qty}
                onChange={(e) => updateAccessoryQty(colorIndex, e.target.value)}
              />
            ) : (
              color.sizes.map((size, sizeIndex) => (
                <div key={size._id} className="size-row">
                  <span>{size.size}</span>

                  <input
                    type="number"
                    value={size.qty}
                    onChange={(e) =>
                      updateQty(colorIndex, sizeIndex, e.target.value)
                    }
                  />
                </div>
              ))
            )}
          </div>
        ))}

        <h4>Total Qty : {formData.totalQuantity}</h4>

        <div className="modal-actions">
          <ContinueButton
            text="Update"
            loading={loading}
            onClick={() => onSave(formData)}
          />

          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
