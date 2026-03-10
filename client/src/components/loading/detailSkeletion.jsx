import React from "react";
import "./productListSkeleton.css";

const DetailSkeleton = () => {
  return (
    <div className="detail-skeleton-container">
      <div className="detail-skeleton-images">
        <div className="skeleton skeleton-main-img"></div>

        <div className="detail-skeleton-thumbs">
          <div className="skeleton thumb"></div>
          <div className="skeleton thumb"></div>
          <div className="skeleton thumb"></div>
          <div className="skeleton thumb"></div>
        </div>
      </div>

      <div className="detail-skeleton-info">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-rating"></div>
        <div className="skeleton skeleton-price"></div>

        <div className="skeleton skeleton-label"></div>

        <div className="detail-skeleton-colors">
          <div className="skeleton color"></div>
          <div className="skeleton color"></div>
          <div className="skeleton color"></div>
        </div>

        <div className="skeleton skeleton-label"></div>

        <div className="detail-skeleton-sizes">
          <div className="skeleton size"></div>
          <div className="skeleton size"></div>
          <div className="skeleton size"></div>
          <div className="skeleton size"></div>
        </div>

        <div className="skeleton skeleton-btn"></div>
      </div>
    </div>
  );
};

export default DetailSkeleton;
