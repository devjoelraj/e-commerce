// import React, { useEffect, useState } from "react";
// import Header from "../../../components/header/userHeader/Header";
// import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

// const AddToCart = () => {
//   // const [razorpayReady, setRazorpayReady] = useState(false);

//   // useEffect(() => {
//   //   const script = document.createElement("script");
//   //   script.src = "https://checkout.razorpay.com/v1/checkout.js";
//   //   script.onload = () => setRazorpayReady(true);
//   //   document.body.appendChild(script);
//   // }, []);

//   const renderingProducts = () => {
//     return (
//       <div
//         style={{
//           display: "flex",
//           gap: "16px",
//           alignItems: "center",
//           flexWrap: "wrap",
//           marginBottom: "16px",
//         }}
//       >
//         <img
//           src="https://via.placeholder.com/100"
//           alt="product"
//           style={{
//             width: "100px",
//             height: "100px",
//             objectFit: "cover",
//             borderRadius: "8px",
//           }}
//         />
//         <div style={{ flex: "1" }}>
//           <p style={{ fontWeight: "bold", margin: "0 0 8px" }}>Product Name</p>
//           <p style={{ margin: "0 0 4px" }}>
//             Size: <span>M</span> | Color: <span>Blue</span>
//           </p>
//           <p style={{ margin: 0 }}>₹1,299</p>
//         </div>
//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <FaMinus style={{ cursor: "pointer" }} />
//           <p style={{ margin: "0 8px" }}>1</p>
//           <FaPlus style={{ cursor: "pointer" }} />
//         </div>
//         <FaTrash
//           style={{ color: "red", cursor: "pointer" }}
//           title="Remove from cart"
//         />
//       </div>
//     );
//   };

//   // const renderingPaymentLogic = () => {
//   //   if (!razorpayReady || typeof window.Razorpay === "undefined") {
//   //     alert("Razorpay is not ready. Please try again later.");
//   //     return;
//   //   }

//   //   const options = {
//   //     key: "rzp_test_7lIAe5dhH",
//   //     amount: 131600,
//   //     currency: "INR",
//   //     name: "Joel Store",
//   //     description: "Order #1234",
//   //     image: "/logo.png",
//   //     handler: function (response) {
//   //       alert(
//   //         "Payment Successful! Payment ID: " + response.razorpay_payment_id
//   //       );
//   //     },
//   //     prefill: {
//   //       name: "Joel",
//   //       email: "joel@example.com",
//   //       contact: "9876543210",
//   //     },
//   //     theme: {
//   //       color: "#007bff",
//   //     },
//   //     method: {
//   //       upi: true,
//   //       card: true,
//   //       netbanking: true,
//   //       wallet: true,
//   //       emi: false,
//   //       paylater: false,
//   //     },
//   //     config: {
//   //       display: {
//   //         blocks: {
//   //           upi_block: {
//   //             name: "Pay using QR Code or UPI",
//   //             instruments: [
//   //               {
//   //                 method: "upi",
//   //               },
//   //             ],
//   //           },
//   //         },
//   //         sequence: ["upi_block"],
//   //         preferences: {
//   //           show_default_blocks: true,
//   //         },
//   //       },
//   //     },
//   //   };

//   //   const rzp = new window.Razorpay(options);
//   //   rzp.open();
//   // };

//   return (
//     <>
//       <Header />
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
//           gap: "16px",
//           padding: "100px 16px 16px",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             border: "1px solid #ddd",
//             borderRadius: "8px",
//             padding: "16px",
//             background: "#fff",
//             boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//           }}
//         >
//           {renderingProducts()}
//           {renderingProducts()}
//           {renderingProducts()}
//           {renderingProducts()}

//           <div
//             style={{
//               borderTop: "1px solid #ccc",
//               paddingTop: "16px",
//               marginTop: "auto",
//               display: "flex",
//               flexDirection: "column",
//               gap: "8px",
//             }}
//           >
//             <div style={{ display: "flex", justifyContent: "space-between" }}>
//               <span>Total:</span>
//               <span>₹1,299</span>
//             </div>
//             <div style={{ display: "flex", justifyContent: "space-between" }}>
//               <span>Sales Tax:</span>
//               <span>₹17</span>
//             </div>
//             {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
//               <span>Coupon Code:</span>
//               <span style={{ fontWeight: "bold" }}>SAVE10</span>
//             </div> */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 fontWeight: "bold",
//               }}
//             >
//               <span>Grand Total:</span>
//               <span>₹1,316</span>
//             </div>
//             <button
//               style={{
//                 marginTop: "12px",
//                 padding: "10px",
//                 backgroundColor: "#007bff",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//                 fontWeight: "bold",
//               }}
//               onClick={renderingPaymentLogic}
//             >
//               Buy Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AddToCart;

import React, { useEffect, useState } from "react";
import Header from "../../../components/header/userHeader/Header";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import {
  getCartService,
  updateCartService,
  removeCartItemService,
} from "../../../api/userServices/addToCartService";
import { getPantsProductByIdService } from "../../../api/userServices/productsServices";
import {
  getAccessoriesProductByIdService,
  getFootwearProductByIdService,
  getShirtsProductByIdService,
} from "../../../api/userServices/userDashboard";

const serviceMap = {
  Pants: getPantsProductByIdService,
  Shirts: getShirtsProductByIdService,
  Footwear: getFootwearProductByIdService,
  Accessories: getAccessoriesProductByIdService,
};

const AddToCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({}); // key: productId_category -> product details
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const getKey = (item) => `${item.productId}-${item.color}-${item.size}`;

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCartService();
      if (res.success) {
        const items = res.data.items || [];
        setCartItems(items);

        // Fetch product details for each item
        const productPromises = items.map(async (item) => {
          const service = serviceMap[item.category];
          if (!service) return null;
          const productRes = await service(item.productId);
          if (productRes?.success) {
            return {
              key: `${item.productId}_${item.category}`,
              data: productRes.data,
            };
          }
          return null;
        });

        const results = await Promise.all(productPromises);
        const newProducts = {};
        results.forEach((r) => {
          if (r) newProducts[r.key] = r.data;
        });
        setProducts(newProducts);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleIncrease = async (item) => {
    const key = getKey(item);
    if (actionLoading[key]) return;

    try {
      setActionLoading((prev) => ({ ...prev, [key]: true }));

      await updateCartService({
        productId: item.productId,
        category: item.category,
        color: item.color,
        size: item.size,
        newQuantity: item.quantity + 1,
      });

      await fetchCart(); // refresh after update
    } catch (err) {
      alert(err.response?.data?.message || "Error updating quantity");
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleDecrease = async (item) => {
    const key = getKey(item);
    if (actionLoading[key] || item.quantity === 1) return;

    try {
      setActionLoading((prev) => ({ ...prev, [key]: true }));

      await updateCartService({
        productId: item.productId,
        category: item.category,
        color: item.color,
        size: item.size,
        newQuantity: item.quantity - 1,
      });

      await fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating quantity");
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleRemove = async (item) => {
    const key = getKey(item);
    if (actionLoading[key]) return;

    try {
      setActionLoading((prev) => ({ ...prev, [key]: true }));

      await removeCartItemService({
        productId: item.productId,
        category: item.category,
        color: item.color,
        size: item.size,
      });

      await fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Error removing item");
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Calculate total using priceAtAdded (now correct from backend)
  const total = cartItems.reduce(
    (acc, item) => acc + item.quantity * (item.priceAtAdded || 0),
    0,
  );

  const renderingProducts = (item, index) => {
    const key = getKey(item);
    const isLoading = actionLoading[key];
    const productKey = `${item.productId}_${item.category}`;
    const product = products[productKey];

    if (!product) return null; // or show a skeleton

    const imageUrl =
      product.colors?.find((c) => c.name === item.color)?.images?.[0]
        ?.imageUrl || "";

    return (
      <div
        key={key}
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          marginBottom: "16px",
          opacity: isLoading ? 0.5 : 1,
        }}
      >
        <img
          src={imageUrl || "https://via.placeholder.com/100"}
          alt={product.productName}
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "8px",
            objectFit: "cover",
          }}
        />

        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: "bold" }}>{product.productName}</p>
          <p>
            Size: {item.size || "-"} | Color: {item.color}
          </p>
          <p>₹{item.priceAtAdded}</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FaMinus
            style={{
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.3 : 1,
            }}
            onClick={() => handleDecrease(item)}
          />
          <p>{isLoading ? "..." : item.quantity}</p>
          <FaPlus
            style={{
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.3 : 1,
            }}
            onClick={() => handleIncrease(item)}
          />
        </div>

        <FaTrash
          style={{
            color: "red",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.3 : 1,
          }}
          onClick={() => handleRemove(item)}
        />
      </div>
    );
  };

  return (
    <>
      <Header />
      <div style={{ padding: "100px 16px" }}>
        <div
          style={{
            border: "1px solid #ddd",
            padding: "16px",
            borderRadius: "8px",
            background: "#fff",
          }}
        >
          {loading ? (
            <p>🔄 Loading cart...</p>
          ) : cartItems.length === 0 ? (
            <p>🛒 Your cart is empty</p>
          ) : (
            cartItems.map(renderingProducts)
          )}

          {cartItems.length > 0 && (
            <>
              <div style={{ marginTop: "20px" }}>
                <strong>Total: ₹{total}</strong>
              </div>

              <button
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  background: "#007bff",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Buy Now
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AddToCart;
