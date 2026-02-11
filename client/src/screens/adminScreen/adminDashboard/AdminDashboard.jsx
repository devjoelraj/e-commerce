import React from "react";
import { FaTasks, FaServer, FaShoppingCart, FaUserPlus } from "react-icons/fa";
import SalesSummaryChart from "../../../components/charts/lineChart";
import "./AdminDashBoard.css";
import StackedBarChart from "../../../components/charts/Stacked";

const data = [
  { weeks: "week1", pastWeek: 4000, presentWeek: 2400 },
  { weeks: "week2", pastWeek: 5000, presentWeek: 2000 },
  { weeks: "week3", pastWeek: 3000, presentWeek: 2700 },
  { weeks: "week4", pastWeek: 2000, presentWeek: 3000 },
];
const ordersData = [
  { day: "Mon", online: 120, offline: 80 },
  { day: "Tue", online: 200, offline: 150 },
  { day: "Wed", online: 170, offline: 100 },
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
        <div className="admindashboard-dashboard-chart">
          <StackedBarChart
            title="Online vs Offline Orders"
            data={ordersData}
            xKey="day"
            stacked={true}
            barKeys={[
              { dataKey: "online", color: "#8a64f0" },
              { dataKey: "offline", color: "#64c2f0" },
            ]}
          />
          ;
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
