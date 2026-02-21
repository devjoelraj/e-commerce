import React, { useState } from "react";
import "./OrdersPage.css";
import presentToast from "../../../../components/Toast/Toast";

const OrdersPage = () => {
  const [orders, setOrders] = useState([
    {
      id: "#78522135",
      product: "Smart Watch",
      qty: 1,
      address: "351 Sherwood Forest Drive",
      date: "20/03/2021",
      price: "$376.00",
      status: "pending",
    },
    {
      id: "#78522136",
      product: "Headphones",
      qty: 2,
      address: "6391 Elgin St. Celina",
      date: "21/03/2021",
      price: "$276.00",
      status: "pending",
    },
    {
      id: "#78522137",
      qty: 2,
      product: "Iphone Pro",
      address: "8502 Preston Rd. Inglewood",
      date: "01/04/2021",
      price: "$300.00",
      status: "pending",
    },
    {
      id: "#78522138",
      product: "Nike Air Max",
      qty: 2,
      address: "3891 Ranchview Dr. Richardson",
      date: "02/04/2021",
      price: "$100.00",
      status: "pending",
    },
    {
      id: "#78522139",
      product: "Apple Watch",
      qty: 2,
      address: "4140 Parker Rd. Allentown",
      date: "07/04/2021",
      price: "$300.00",
      status: "pending",
    },
  ]);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [emailMessage, setEmailMessage] = useState("");

  const handleTakeOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "packing" } : order,
      ),
    );
  };

  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = () => {
    if (!emailMessage.trim()) {
      presentToast.error("Please write email message");
      return;
    }

    setOrders((prev) =>
      prev.map((order) =>
        order.id === selectedOrder.id
          ? { ...order, status: "cancelled" }
          : order,
      ),
    );

    presentToast.success("Order cancelled and email sent");

    setShowCancelModal(false);
    setEmailMessage("");
    setSelectedOrder(null);
  };

  // ✅ PRINT ONLY TAKEN ORDERS
  const handlePrintTakenOrders = () => {
    const takenOrders = orders.filter((order) => order.status === "packing");

    if (takenOrders.length === 0) {
      presentToast.success("No taken orders to print");
      return;
    }

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Taken Orders</title>
        </head>
        <body>
          <h2>Taken Orders</h2>
          ${takenOrders
            .map(
              (order) => `
                <div style="margin-bottom:20px;">
                  <p><strong>Order ID:</strong> ${order.id}</p>
                  <p><strong>Product:</strong> ${order.product}</p>
                  <p><strong>Quantity:</strong> ${order.qty}</p>
                  <p><strong>Address:</strong> ${order.address}</p>
                  <p><strong>Date:</strong> ${order.date}</p>
                  <p><strong>Price:</strong> ${order.price}</p>
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

  return (
    <div className="orderspage-container">
      <h2 className="orderspage-title">Orders</h2>

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
        Print Taken Orders
      </button>

      <div className="orderspage-table-wrapper">
        <table className="orderspage-table">
          <thead className="orderspage-thead">
            <tr className="orderspage-header-row">
              <th className="orderspage-th">#</th>
              <th className="orderspage-th">Order ID</th>
              <th className="orderspage-th">Product Name</th>
              <th className="orderspage-th">Quantity</th>
              <th className="orderspage-th">Address</th>
              <th className="orderspage-th">Date</th>
              <th className="orderspage-th">Price</th>
              <th className="orderspage-th">Action</th>
            </tr>
          </thead>

          <tbody className="orderspage-tbody">
            {orders.map((order, index) => (
              <tr key={order.id} className="orderspage-row">
                <td className="orderspage-td">{index + 1}</td>
                <td className="orderspage-td orderspage-orderid">{order.id}</td>
                <td className="orderspage-td">{order.product}</td>
                <td className="orderspage-td">{order.qty}</td>
                <td className="orderspage-td">{order.address}</td>
                <td className="orderspage-td">{order.date}</td>
                <td className="orderspage-td">{order.price}</td>

                <td
                  className="orderspage-td"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {order.status === "pending" && (
                    <>
                      <button
                        className="orderspage-btn"
                        onClick={() => handleTakeOrder(order.id)}
                      >
                        taken
                      </button>

                      <button
                        className="orderspage-btn"
                        onClick={() => openCancelModal(order)}
                      >
                        cancel
                      </button>
                    </>
                  )}

                  {order.status === "packing" && (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      packing
                    </span>
                  )}

                  {order.status === "cancelled" && (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      cancelled
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCancelModal && (
        <div className="cancel-modal-overlay">
          <div className="cancel-modal">
            <h3>Cancel Order {selectedOrder?.id}</h3>

            <textarea
              placeholder="Write email message to customer..."
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              rows={5}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "10px",
              }}
            />

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                gap: "10px",
              }}
            >
              <button className="orderspage-btn" onClick={confirmCancelOrder}>
                Send & Cancel
              </button>

              <button
                className="orderspage-btn"
                onClick={() => setShowCancelModal(false)}
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
