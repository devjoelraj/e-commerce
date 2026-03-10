import React from "react";
import "./productListSkeleton.css";

const ProductListSkeleton = () => {
  const skeletonArray = Array(10).fill(0);

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
