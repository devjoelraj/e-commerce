import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import Header from "../../../components/header/userHeader/Header";
import OrderCard from "../../../components/orderCards/OrderCard";
import presentToast from "../../../components/Toast/Toast";
import { tokenManager } from "../../../api/tokenManager";
import "./Profile.css";
import {
  cancelOrder,
  getUserProfile,
  logoutService,
} from "../../../api/userServices/getProfile";
import myIcon from "../../../assets/loader.svg";
import Footer from "../../../components/footer/Footer";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false); // 👈 loading for cancel

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const res = await getUserProfile();
    console.log(res, "res");
    if (res.success) {
      setUser(res.user);
      setActiveOrders(res.activeOrders || []);
      setOrderHistory(res.orderHistory || []);
    } else {
      presentToast.error("Please login again");
      if (
        res.message?.includes("Not authorized") ||
        res.message?.includes("token")
      ) {
        tokenManager.clearToken();
        navigate("/login");
      }
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const res = await logoutService();
      if (!res.success) {
        console.warn("Logout API failed, but clearing local session");
      }
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      tokenManager.clearToken();
      navigate("/");
    }
  };

  const handleLogin = () => {
    navigate("/", { state: { signup: true } });
  };

  const openModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (!cancelReason.trim()) {
      presentToast.error("Please enter a cancellation reason");
      return;
    }
    setCancelling(true);
    const res = await cancelOrder(selectedOrderId, cancelReason);
    if (res.success) {
      presentToast.success("Order cancelled successfully");
      fetchProfile();
    } else {
      presentToast.error(res.message || "Failed to cancel order");
    }
    setCancelling(false);
    setIsModalOpen(false);
    setCancelReason("");
    setSelectedOrderId(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCancelReason("");
    setSelectedOrderId(null);
  };

  const getInitials = () => {
    if (!user?.username) return "U";
    return user.username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading)
    return (
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
    );

  if (!user) {
    return (
      <>
        <Header />
        <div className="login-prompt">
          <h2>You are not logged in</h2>
          <button onClick={handleLogin} className="login-btn">
            Go to Login
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <p className="profile-avatar">{getInitials()}</p>
          <div>
            <h2>{user.username || "User"}</h2>
            <p>{user.email}</p>
            <button
              className="logout-btn"
              onClick={handleLogout}
              disabled={logoutLoading}
            >
              {logoutLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>

        {/* Active Orders */}
        <div className="profile-section">
          <h3>Active Orders</h3>
          <div className="flash-deals">
            {activeOrders.length === 0 ? (
              <p>No active orders</p>
            ) : (
              activeOrders.map((order) => (
                <div
                  className="card-wrapper"
                  key={order._id}
                  style={{ display: "flex", flexDirection: "row", gap: "8px" }}
                >
                  {order.items.map((orderItem) => (
                    <OrderCard
                      key={orderItem._id}
                      productname={orderItem.productName}
                      price={orderItem.priceAtPurchase}
                      image={
                        orderItem.image || "https://via.placeholder.com/200"
                      }
                      status={order.orderStatus}
                      onCancel={
                        order.orderStatus === "pending"
                          ? () => openModal(order._id)
                          : undefined
                      }
                      // optional: disable cancel button while modal open? handled by modal loading
                    />
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order History */}
        <div className="profile-section">
          <h3>Order History</h3>
          <div className="flash-deals">
            {orderHistory.length === 0 ? (
              <p>No past orders</p>
            ) : (
              orderHistory.map((order) => (
                <div
                  className="card-wrapper"
                  key={order._id}
                  style={{ display: "flex", flexDirection: "row", gap: "8px" }}
                >
                  {order.items.map((orderItem) => (
                    <OrderCard
                      key={orderItem._id}
                      productname={orderItem.productName}
                      price={orderItem.priceAtPurchase}
                      image={
                        orderItem.image || "https://via.placeholder.com/200"
                      }
                      status={order.orderStatus}
                    />
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
      {/* Cancel Modal */}
      <Modal
        title="Cancel Order"
        centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Confirm Cancel"
        okButtonProps={{ danger: true }}
        confirmLoading={cancelling} // 👈 this shows spinner and disables OK button
      >
        <textarea
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Enter cancellation reason"
          style={{
            width: "100%",
            height: "100px",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </Modal>
    </>
  );
};

export default Profile;
