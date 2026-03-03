import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import Header from "../../../components/header/userHeader/Header";
import OrderCard from "../../../components/orderCards/OrderCard";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const [user] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [orders, setOrders] = useState([
    {
      id: 1,
      productname: "Cool T-Shirt",
      price: 234,
      image: "https://picsum.photos/200/300",
      status: "PLACED",
    },
    {
      id: 2,
      productname: "Sneakers",
      price: 999,
      image: "https://picsum.photos/200/301",
      status: "DELIVERED",
    },
  ]);

  const handleLogout = () => {
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/", { state: { signup: true } });
  };

  const openModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === selectedOrderId
          ? { ...order, status: "CANCEL_REQUESTED" }
          : order,
      ),
    );

    setIsModalOpen(false);
    setCancelReason("");
    setSelectedOrderId(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCancelReason("");
    setSelectedOrderId(null);
  };

  return (
    <>
      <Header />

      {!user ? (
        <div className="profile-container">
          {/* Profile Header */}
          <div className="profile-header">
            <p className="profile-avatar">JR</p>
            <div>
              <h2>Joel</h2>
              <p>joel@gmail.com</p>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          {/* Active Orders */}
          <div className="profile-section">
            <h3>Active Orders</h3>

            <div className="flash-deals">
              {orders
                .filter(
                  (order) =>
                    order.status !== "DELIVERED" &&
                    order.status !== "CANCELLED",
                )
                .map((order) => (
                  <div className="card-wrapper" key={order.id}>
                    <OrderCard
                      productname={order.productname}
                      price={order.price}
                      image={order.image}
                      status={order.status}
                      onCancel={() => openModal(order.id)}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Order History */}
          <div className="profile-section">
            <h3>Order History</h3>

            <div className="flash-deals">
              {orders
                .filter((order) => order.status === "DELIVERED")
                .map((order) => (
                  <div className="card-wrapper" key={order.id}>
                    <OrderCard
                      productname={order.productname}
                      price={order.price}
                      image={order.image}
                      status={order.status}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="login-prompt">
          <h2>You are not logged in</h2>
          <button onClick={handleLogin} className="login-btn">
            Go to Login
          </button>
        </div>
      )}

      {/* Cancel Modal */}
      <Modal
        title="Cancel Order"
        centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Confirm Cancel"
        okButtonProps={{ danger: true }}
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
