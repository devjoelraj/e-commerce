import React, { useState, useEffect } from "react";
import ContinueButton from "../../../components/buttons/ContinueButton";
import presentToast from "../../../components/Toast/Toast";
import "./AddressPopup.css";
import {
  getUserAddress,
  saveUserAddress,
} from "../../../api/userServices/addToCartService";

const AddressPopup = ({ open, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    pincode: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    if (open) {
      fetchAddress();
    }
  }, [open]);

  const fetchAddress = async () => {
    setLoading(true);
    const res = await getUserAddress();
    if (res.success && res.data) {
      setAddress(res.data);
    } else {
      setAddress({
        fullName: "",
        mobile: "",
        pincode: "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        city: "",
        state: "",
      });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "fullName",
      "mobile",
      "pincode",
      "addressLine1",
      "city",
      "state",
    ];
    for (let field of requiredFields) {
      if (!address[field]) {
        presentToast.error(`${field} is required`);
        return;
      }
    }

    setSaving(true);
    const res = await saveUserAddress(address);
    setSaving(false);
    if (res.success) {
      onSubmit(res.data);
      onClose();
    } else {
      presentToast.error(res.message || "Failed to save address");
    }
  };

  if (!open) return null;

  return (
    <div className="address-popup__overlay" onClick={onClose}>
      <div
        className="address-popup__content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="address-popup__title">Delivery Address</h2>
        <button className="address-popup__close" onClick={onClose}>
          ×
        </button>

        {loading ? (
          <p className="address-popup__loading">Loading...</p>
        ) : (
          <div className="address-popup__form">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name *"
              value={address.fullName}
              onChange={handleChange}
              className="address-popup__input"
            />
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number *"
              value={address.mobile}
              onChange={handleChange}
              className="address-popup__input"
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode *"
              value={address.pincode}
              onChange={handleChange}
              className="address-popup__input"
            />
            <input
              type="text"
              name="addressLine1"
              placeholder="Address Line 1 *"
              value={address.addressLine1}
              onChange={handleChange}
              className="address-popup__input"
            />
            <input
              type="text"
              name="addressLine2"
              placeholder="Address Line 2 (optional)"
              value={address.addressLine2}
              onChange={handleChange}
              className="address-popup__input"
            />
            <input
              type="text"
              name="landmark"
              placeholder="Landmark (optional)"
              value={address.landmark}
              onChange={handleChange}
              className="address-popup__input"
            />
            <input
              type="text"
              name="city"
              placeholder="City *"
              value={address.city}
              onChange={handleChange}
              className="address-popup__input"
            />
            <input
              type="text"
              name="state"
              placeholder="State *"
              value={address.state}
              onChange={handleChange}
              className="address-popup__input"
            />

            <div className="address-popup__actions">
              <ContinueButton
                text="Continue"
                onClick={handleSubmit}
                loading={saving}
                disabled={saving}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressPopup;
