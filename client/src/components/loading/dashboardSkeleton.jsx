import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="dashboard-skeleton">
      <div className="skeleton-carousel skeleton"></div>

      <div style={{ padding: 16 }}>
        <h3>Best selling products</h3>
        <div className="flash-deals">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card-wrapper">
              <div className="skeleton-card">
                <div className="skeleton-img skeleton"></div>
                <div className="skeleton-text skeleton"></div>
                <div className="skeleton-price skeleton"></div>
              </div>
            </div>
          ))}
        </div>

        <h3>Browse By Category</h3>
        <div className="flash-deals">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="category-skeleton skeleton"></div>
          ))}
        </div>

        <h3 style={{ marginTop: "40px" }}>Flash Deals</h3>
        <div className="flash-deals">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card-wrapper">
              <div className="skeleton-card">
                <div className="skeleton-img skeleton"></div>
                <div className="skeleton-text skeleton"></div>
                <div className="skeleton-price skeleton"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
