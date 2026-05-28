import React, { useEffect, useState } from "react";
import Header from "../../../components/header/userHeader/Header";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import {
  getCartService,
  updateCartService,
  removeCartItemService,
  placeOrderService,
} from "../../../api/userServices/addToCartService";
import { getPantsProductByIdService } from "../../../api/userServices/productsServices";
import {
  getAccessoriesProductByIdService,
  getFootwearProductByIdService,
  getShirtsProductByIdService,
} from "../../../api/userServices/userDashboard";
import presentToast from "../../../components/Toast/Toast"; // 👈 for notifications
import AddressPopup from "./AddressPopup";
import { MdOutlineShoppingCart } from "react-icons/md";
import myIcon from "../../../assets/loader.svg";
import Footer from "../../../components/footer/Footer";
const serviceMap = {
  Pants: getPantsProductByIdService,
  Shirts: getShirtsProductByIdService,
  Footwear: getFootwearProductByIdService,
  Accessories: getAccessoriesProductByIdService,
};

const AddToCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [showAddressPopup, setShowAddressPopup] = useState(false);

  const getKey = (item) => `${item.productId}-${item.color}-${item.size}`;

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCartService();
      console.log(res, "cart");
      if (res.success) {
        const items = res.data.items || [];
        setCartItems(items);
        console.log(cartItems, "cartitems");
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

      await fetchCart();
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

  const total = cartItems.reduce(
    (acc, item) => acc + item.quantity * (item.priceAtAdded || 0),
    0,
  );

  const handleBuyNow = () => {
    console.log("hi");
    if (cartItems.length === 0) {
      presentToast.error("Your cart is empty");
      return;
    }
    setShowAddressPopup(true);
  };

  const handleAddressSubmit = async (address) => {
    setShowAddressPopup(false);
    const orderData = {
      address: address,
    };
    const res = await placeOrderService(orderData);
    console.log(res, "order");
    if (res.success) {
      presentToast.success("Order placed successfully!");
      fetchCart();
    } else {
      presentToast.error(res.message || "Order failed");
    }
  };

  const renderingProducts = (item, index) => {
    const key = getKey(item);
    const isLoading = actionLoading[key];
    const productKey = `${item.productId}_${item.category}`;
    const product = products[productKey];

    if (!product) return null;

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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <img src={myIcon} alt="description" className="my-icon" />
            </div>
          ) : cartItems.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <MdOutlineShoppingCart size={48} />
              <p>Your cart is empty</p>
            </div>
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
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
      {/* Address Popup */}
      <AddressPopup
        open={showAddressPopup}
        onClose={() => setShowAddressPopup(false)}
        onSubmit={handleAddressSubmit}
      />
    </>
  );
};

export default AddToCart;
