import React from "react";
import "./productListSkeleton.css";

const ProductListSkeleton = ({ count = 10 }) => {
  const skeletonArray = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {skeletonArray.map((_, index) => (
        <div className="product-skeleton-card" key={index}>
          <div className="skeleton-image"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text small"></div>
        </div>
      ))}
    </>
  );
};

export default ProductListSkeleton;
