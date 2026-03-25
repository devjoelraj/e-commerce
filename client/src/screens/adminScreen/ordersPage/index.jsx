import React, { useState, useEffect } from "react";
import "./OrdersPage.css";
import presentToast from "../../../components/Toast/Toast";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../../api/adminServices/orderService";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [emailMessage, setEmailMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 100000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    console.log("Fetching orders...");
    setLoading(true);
    const res = await getAllOrders();
    if (res.success) {
      console.log("Orders fetched:", res.orders);
      setOrders(res.orders || []);
    } else {
      console.error("Failed to fetch orders:", res.message);
      presentToast.error(res.message || "Failed to load orders");
    }
    setLoading(false);
  };

  const handleTakeOrder = async (orderId) => {
    console.log("Take order clicked for order:", orderId);
    const res = await updateOrderStatus(orderId, "shipped");
    if (res.success) {
      presentToast.success("Order marked as out for delivery");
      fetchOrders();
    } else {
      presentToast.error(res.message || "Failed to take order");
    }
  };

  const openCancelModal = (order) => {
    console.log("Opening cancel modal for order:", order);
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    console.log("Confirm cancel for order:", selectedOrder?._id);
    if (!emailMessage.trim()) {
      console.warn("Email message empty");
      presentToast.error("Please write email message");
      return;
    }

    const res = await updateOrderStatus(
      selectedOrder._id,
      "cancelled",
      emailMessage,
    );
    if (res.success) {
      console.log("Order cancelled successfully:", selectedOrder._id);
      presentToast.success("Order cancelled and email sent");
      fetchOrders();
    } else {
      console.error("Failed to cancel order:", res.message);
      presentToast.error(res.message || "Failed to cancel order");
    }

    setShowCancelModal(false);
    setEmailMessage("");
    setSelectedOrder(null);
  };

  const handlePrintTakenOrders = () => {
    const takenOrders = orders.filter(
      (order) => order.orderStatus?.toLowerCase() === "shipped",
    );

    if (takenOrders.length === 0) {
      presentToast.success("No out‑for‑delivery orders to print");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Out for Delivery Orders</title>
        </head>
        <body>
          <h2>Out for Delivery Orders</h2>
          ${takenOrders
            .map(
              (order) => `
                <div style="margin-bottom:20px;">
                  <p><strong>Order ID:</strong> ${order._id}</p>
                  <p><strong>Customer:</strong> ${order.shippingAddress.fullName}</p>
                  <p><strong>Items:</strong> ${order.items
                    .map(
                      (item) =>
                        `${item.productName} (${item.color}, x${item.quantity})`,
                    )
                    .join("; ")}</p>
                  <p><strong>Total:</strong> ₹${order.totalAmount}</p>
                  <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                  <hr/>
                </div>
              `,
            )
            .join("")}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Count pending orders (status "pending")
  const pendingCount = orders.filter(
    (order) => order.orderStatus?.toLowerCase() === "pending",
  ).length;

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="orderspage-container">
      <div className="orderspage-header">
        <h2 className="orderspage-title">Orders</h2>
        <div className="pending-tasks-box">
          <span className="pending-tasks-label">Pending Orders</span>
          <span className="pending-tasks-count">{pendingCount}</span>
        </div>
      </div>

      <button
        style={{
          marginBottom: "10px",
          padding: "8px 16px",
          cursor: "pointer",
          backgroundColor: "blue",
          border: "transparent",
          borderRadius: "8px",
          color: "white",
        }}
        onClick={handlePrintTakenOrders}
      >
        Print Out‑for‑Delivery Orders
      </button>

      <div className="orderspage-table-wrapper">
        <table className="orderspage-table">
          <thead className="orderspage-thead">
            <tr className="orderspage-header-row">
              <th className="orderspage-th">#</th>
              <th className="orderspage-th">Order ID</th>
              <th className="orderspage-th">Customer</th>
              <th className="orderspage-th">Items (Color, Qty)</th>
              <th className="orderspage-th">Address</th>
              <th className="orderspage-th">Date</th>
              <th className="orderspage-th">Total</th>
              <th className="orderspage-th">Status</th>
              <th className="orderspage-th">Actions</th>
            </tr>
          </thead>
          <tbody className="orderspage-tbody">
            {orders.map((order, index) => (
              <tr key={order._id} className="orderspage-row">
                <td className="orderspage-td">{index + 1}</td>
                <td className="orderspage-td orderspage-orderid">
                  {order._id}
                </td>
                <td className="orderspage-td">
                  {order.shippingAddress?.fullName || "N/A"}
                </td>
                <td className="orderspage-td">
                  {order.items?.map((item) => (
                    <div key={item._id}>
                      {item.productName} ({item.color}, x{item.quantity})
                    </div>
                  ))}
                </td>
                <td className="orderspage-td">
                  {order.shippingAddress?.addressLine1},{" "}
                  {order.shippingAddress?.city}
                </td>
                <td className="orderspage-td">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="orderspage-td">₹{order.totalAmount}</td>
                <td className="orderspage-td">
                  {order.orderStatus === "shipped"
                    ? "Out for delivery"
                    : order.orderStatus}
                </td>
                <td
                  className="orderspage-td"
                  style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}
                >
                  {order.orderStatus?.toLowerCase() === "pending" && (
                    <>
                      <button
                        className="orderspage-btn"
                        onClick={() => handleTakeOrder(order._id)}
                      >
                        take
                      </button>
                      <button
                        className="orderspage-btn"
                        onClick={() => openCancelModal(order)}
                      >
                        cancel
                      </button>
                    </>
                  )}
                  {order.orderStatus?.toLowerCase() === "shipped" && (
                    <span style={{ color: "blue", fontWeight: "bold" }}>
                      Out for delivery
                    </span>
                  )}
                  {order.orderStatus?.toLowerCase() === "delivered" && (
                    <span style={{ color: "gray", fontWeight: "bold" }}>
                      Delivered
                    </span>
                  )}
                  {order.orderStatus?.toLowerCase() === "cancelled" && (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      Cancelled
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div
          className="orderpage-modal-overlay"
          onClick={() => {
            console.log("Overlay clicked, closing modal");
            setShowCancelModal(false);
          }}
        >
          <div
            className="orderpage-modal"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Modal content clicked, not closing");
            }}
          >
            <h3>Cancel Order {selectedOrder?._id}</h3>

            <textarea
              placeholder="Write email message to customer..."
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              rows={5}
            />

            <div className="orderpage-modal-actions">
              <button
                className="orderpage-modal-btn"
                onClick={() => {
                  console.log("Send & Cancel clicked");
                  confirmCancelOrder();
                }}
              >
                Send & Cancel
              </button>
              <button
                className="orderpage-modal-btn close"
                onClick={() => {
                  console.log("Close modal clicked");
                  setShowCancelModal(false);
                  setEmailMessage("");
                  setSelectedOrder(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
