import React from "react";
import "./OrdersPage.css";

const OrdersPage = () => {
  // Sample data (5 products)
  const orders = [
    {
      id: "#78522135",
      product: "Smart Watch",
      address: "351 Sherwood Forest Drive",
      date: "20/03/2021",
      price: "$376.00",
    },
    {
      id: "#78522136",
      product: "Headphones",
      address: "6391 Elgin St. Celina",
      date: "21/03/2021",
      price: "$276.00",
    },
    {
      id: "#78522137",
      product: "Iphone Pro",
      address: "8502 Preston Rd. Inglewood",
      date: "01/04/2021",
      price: "$300.00",
    },
    {
      id: "#78522138",
      product: "Nike Air Max",
      address: "3891 Ranchview Dr. Richardson",
      date: "02/04/2021",
      price: "$100.00",
    },
    {
      id: "#78522139",
      product: "Apple Watch",
      address: "4140 Parker Rd. Allentown",
      date: "07/04/2021",
      price: "$300.00",
    },
  ];

  return (
    <div className="orderspage-container">
      <h2 className="orderspage-title">Orders</h2>
      <div className="orderspage-table-wrapper">
        <table className="orderspage-table">
          <thead className="orderspage-thead">
            <tr className="orderspage-header-row">
              <th className="orderspage-th">#</th>
              <th className="orderspage-th">Order ID</th>
              <th className="orderspage-th">Product Name</th>
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
                <td className="orderspage-td">{order.address}</td>
                <td className="orderspage-td">{order.date}</td>
                <td className="orderspage-td">{order.price}</td>
                <td className="orderspage-td">
                  <button
                    className="orderspage-btn"
                    onClick={() => {
                      console.log(order, "selected oder");
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
