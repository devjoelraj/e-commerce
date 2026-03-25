import React, { useEffect, useState } from "react";
import { FaTasks, FaServer, FaShoppingCart, FaUserPlus } from "react-icons/fa";
import SalesSummaryChart from "../../../components/charts/lineChart";
import StackedBarChart from "../../../components/charts/Stacked";
import {
  getMonthlySalesData,
  getTopProducts,
} from "../../../api/adminServices/DashboardService";
import "./AdminDashBoard.css";
import myIcon from "../../../assets/loader.svg";

const AdminDashBoardHome = () => {
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [salesRes, topRes] = await Promise.all([
        getMonthlySalesData(6),
        getTopProducts(5),
      ]);
      if (salesRes.success) setSalesData(salesRes.data);
      else setError(salesRes.message || "Failed to load sales data");
      if (topRes.success) setTopProducts(topRes.products);
      else console.error(topRes.message);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Prepare data for stacked bar chart (amounts)
  const stackedData = salesData.map((item) => ({
    month: item.monthLabel,
    online: item.onlineAmount,
    offline: item.offlineAmount,
  }));

  // Prepare data for line chart (counts)
  const lineData = salesData.map((item) => ({
    month: item.monthLabel,
    onlineCount: item.onlineCount,
    offlineCount: item.offlineCount,
  }));

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

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <img src={myIcon} alt="Loading" />
      </div>
    );
  }
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      <div className="admindashboard-dashboard-row">
        <div className="admindashboard-dashboard-chart">
          <SalesSummaryChart
            title="Number of Orders / Sales (Monthly)"
            chartData={lineData}
            xKey="month"
            lineKeys={[
              {
                dataKey: "onlineCount",
                color: "#8a64f0",
                name: "Online Orders",
              },
              {
                dataKey: "offlineCount",
                color: "#64c2f0",
                name: "Offline Sales",
              },
            ]}
          />
        </div>
        <div className="admindashboard-dashboard-chart">
          <StackedBarChart
            title="Sales Value (₹) - Online vs Offline"
            data={stackedData}
            xKey="month"
            stacked={true}
            barKeys={[
              { dataKey: "online", color: "#8a64f0", name: "Online" },
              { dataKey: "offline", color: "#64c2f0", name: "Offline" },
            ]}
          />
        </div>
      </div>

      {/* Top Products Table (unchanged) */}
      <div className="admindashboard-dashboard-card">
        <h3 className="admindashboard-card-title">Top Selling Products</h3>
        <p className="admindashboard-card-subtitle">
          Based on total units sold
        </p>
        <div className="admindashboard-table-header">
          <span>Product</span>
          <span>Units Sold</span>
          <span>Avg Price</span>
        </div>
        {topProducts.map((item, index) => (
          <div className="admindashboard-table-row" key={index}>
            <span>{item.productName}</span>
            <span>{item.totalQuantity}</span>
            <span>₹{item.averagePrice.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminDashBoardHome;
