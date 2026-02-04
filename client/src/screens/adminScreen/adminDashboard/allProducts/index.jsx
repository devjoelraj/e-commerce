import React from "react";
import "./AllProducts.css";

const AllProducts = () => {
  const products = [
    { id: 1, productName: "Shirt", totalProduct: 10, remendingProduct: 5 },
    { id: 2, productName: "Shoes", totalProduct: 25, remendingProduct: 12 },
    { id: 3, productName: "Watch", totalProduct: 15, remendingProduct: 8 },
    { id: 4, productName: "Bag", totalProduct: 30, remendingProduct: 20 },
    { id: 5, productName: "Laptop", totalProduct: 8, remendingProduct: 3 },
  ];

  return (
    <div className="allproducts-container">
      <h2 className="allproducts-heading">All Products</h2>
      <table className="allproducts-table">
        <thead>
          <tr>
            <th className="allproducts-th">#</th>
            <th className="allproducts-th">Product Name</th>
            <th className="allproducts-th">Total Product</th>
            <th className="allproducts-th">Remaining Product</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, index) => (
            <tr key={item.id} className="allproducts-tr">
              <td className="allproducts-td">{index + 1}</td>
              <td className="allproducts-td">{item.productName}</td>
              <td className="allproducts-td">{item.totalProduct}</td>
              <td className="allproducts-td">{item.remendingProduct}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllProducts;
