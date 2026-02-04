import React from "react";
import { FaTasks, FaServer, FaShoppingCart, FaUserPlus } from "react-icons/fa";
import SalesSummaryChart from "../../../components/charts/lineChart";
import "./AdminDashBoard.css";

const data = [
  { month: "Jan", iPhone: 4000, iPad: 2400 },
  { month: "Feb", iPhone: 3000, iPad: 1398 },
  { month: "Mar", iPhone: 2000, iPad: 9800 },
  { month: "Apr", iPhone: 2780, iPad: 3908 },
  { month: "May", iPhone: 1890, iPad: 4800 },
  { month: "Jun", iPhone: 2390, iPad: 3800 },
  { month: "Jul", iPhone: 3490, iPad: 4300 },
  { month: "Aug", iPhone: 5000, iPad: 6000 },
];

const feedItems = [
  {
    icon: <FaTasks color="#4a90e2" />,
    text: "You have 4 pending tasks.",
    time: "Just Now",
  },
  {
    icon: <FaServer color="#2ecc71" />,
    text: "Server #1 overloaded.",
    time: "2 Hours ago",
  },
  {
    icon: <FaShoppingCart color="#f39c12" />,
    text: "New order received.",
    time: "23 May",
  },
  {
    icon: <FaUserPlus color="#e74c3c" />,
    text: "New user registered.",
    time: "30 May",
  },
];

const topsellingProducts = [
  { product: "iPhone 13", orders: 120, price: "$999" },
  { product: "MacBook Pro", orders: 80, price: "$1999" },
  { product: "iPad Air", orders: 60, price: "$599" },
  { product: "Apple Watch", orders: 50, price: "$399" },
];

const AdminDashBoardHome = () => {
  return (
    <>
      {/* Row with chart and feeds */}
      <div className="admindashboard-dashboard-row">
        <div className="admindashboard-dashboard-chart">
          <SalesSummaryChart chartData={data} />
        </div>

        <div className="admindashboard-dashboard-feed">
          <div className="admindashboard-feed-card">
            <h3 className="admindashboard-feed-title">Feeds</h3>
            <ul className="admindashboard-feed-list">
              {feedItems.map((item, index) => (
                <li className="admindashboard-feed-item" key={index}>
                  <div className="admindashboard-feed-icon">{item.icon}</div>
                  <div className="admindashboard-feed-content">
                    <p className="admindashboard-feed-text">{item.text}</p>
                    <span className="admindashboard-feed-time">
                      {item.time}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="admindashboard-dashboard-card">
        <h3 className="admindashboard-card-title">Top Selling Products</h3>
        <p className="admindashboard-card-subtitle">Overview of top items</p>

        <div className="admindashboard-table-header">
          <span>Product</span>
          <span>Orders</span>
          <span>Price</span>
        </div>

        {topsellingProducts.map((item, index) => (
          <div className="admindashboard-table-row" key={index}>
            <span>{item.product}</span>
            <span>{item.orders}</span>
            <span>{item.price}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminDashBoardHome;
