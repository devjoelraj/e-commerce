import React from "react";
import ProductCards from "../../../components/productCards/ProductCards";
import Header from "../../../components/header/userHeader/Header";

const WatchList = () => {
  return (
    <>
      <Header />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: "16px",
          padding: "100px 0 0 0",
        }}
      >
        <ProductCards />
      </div>
    </>
  );
};

export default WatchList;
