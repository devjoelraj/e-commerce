import React, { useEffect, useState } from "react";
import Header from "../../../components/header/userHeader/Header";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

const AddToCart = () => {
  const [razorpayReady, setRazorpayReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayReady(true);
    document.body.appendChild(script);
  }, []);

  const renderingProducts = () => {
    return (
      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "16px",
        }}
      >
        <img
          src="https://via.placeholder.com/100"
          alt="product"
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
        <div style={{ flex: "1" }}>
          <p style={{ fontWeight: "bold", margin: "0 0 8px" }}>Product Name</p>
          <p style={{ margin: "0 0 4px" }}>
            Size: <span>M</span> | Color: <span>Blue</span>
          </p>
          <p style={{ margin: 0 }}>₹1,299</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FaMinus style={{ cursor: "pointer" }} />
          <p style={{ margin: "0 8px" }}>1</p>
          <FaPlus style={{ cursor: "pointer" }} />
        </div>
        <FaTrash
          style={{ color: "red", cursor: "pointer" }}
          title="Remove from cart"
        />
      </div>
    );
  };

  const renderingPaymentLogic = () => {
    if (!razorpayReady || typeof window.Razorpay === "undefined") {
      alert("Razorpay is not ready. Please try again later.");
      return;
    }

    const options = {
      key: "rzp_test_7lIAe5dhH",
      amount: 131600,
      currency: "INR",
      name: "Joel Store",
      description: "Order #1234",
      image: "/logo.png",
      handler: function (response) {
        alert(
          "Payment Successful! Payment ID: " + response.razorpay_payment_id
        );
      },
      prefill: {
        name: "Joel",
        email: "joel@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#007bff",
      },
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
        emi: false,
        paylater: false,
      },
      config: {
        display: {
          blocks: {
            upi_block: {
              name: "Pay using QR Code or UPI",
              instruments: [
                {
                  method: "upi",
                },
              ],
            },
          },
          sequence: ["upi_block"],
          preferences: {
            show_default_blocks: true,
          },
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <Header />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px",
          padding: "100px 16px 16px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            background: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {renderingProducts()}
          {renderingProducts()}
          {renderingProducts()}
          {renderingProducts()}

          <div
            style={{
              borderTop: "1px solid #ccc",
              paddingTop: "16px",
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Total:</span>
              <span>₹1,299</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Sales Tax:</span>
              <span>₹17</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Coupon Code:</span>
              <span style={{ fontWeight: "bold" }}>SAVE10</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
              }}
            >
              <span>Grand Total:</span>
              <span>₹1,316</span>
            </div>
            <button
              style={{
                marginTop: "12px",
                padding: "10px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={renderingPaymentLogic}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddToCart;
