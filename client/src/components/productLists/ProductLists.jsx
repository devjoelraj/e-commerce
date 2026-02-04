import React from "react";
import { useLocation } from "react-router-dom";
import ProductCards from "../productCards/ProductCards";
import Header from "../header/userHeader/Header";

const ProductLists = () => {
  const location = useLocation();
  const category = location?.state?.category || "";
  const data = location?.state?.data || "";
  console.log(category, "Product Details category");
  console.log(data, "Product Details Data");
  return (
    <div>
      <Header />
      <div style={{ padding: "100px 16px 0 0" }}>
        <ProductCards />
      </div>
    </div>
  );
};

export default ProductLists;
