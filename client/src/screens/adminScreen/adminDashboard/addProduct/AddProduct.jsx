import React from "react";
import { FaPlus } from "react-icons/fa";
import "./AddProduct.css";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigation = useNavigate();

  const ProductSectionHeader = ({ title, onViewAll }) => (
    <div className="admindashboard-card-header">
      <h3>{title}</h3>
      <div className="admindashboard-header-actions">
        <FaPlus
          className="admindashboard-add-icon"
          onClick={() =>
            navigation("/admin/upload-product-details", { details: title })
          }
        />

        <p onClick={onViewAll}>View All</p>
      </div>
    </div>
  );

  const sections = [
    {
      title: "Dashboard Slider",
      subtitle: "Image upload",
      products: [],
      onViewAll: () => console.log("View all slider items"),
    },
    {
      title: "Trends Products",
      products: [
        { id: 1, name: "Product 1", price: "$99", image: "Image" },
        { id: 2, name: "Product 2", price: "$149", image: "Image" },
        { id: 3, name: "Product 3", price: "$199", image: "Image" },
      ],
      onViewAll: () => console.log("View all trends"),
    },
    {
      title: "Offers Products",
      products: [
        { id: 4, name: "Product 1", price: "$79", image: "Image" },
        { id: 5, name: "Product 2", price: "$89", image: "Image" },
        { id: 6, name: "Product 3", price: "$99", image: "Image" },
      ],
      onViewAll: () => console.log("View all offers"),
    },
    {
      title: "New Products",
      products: [
        { id: 7, name: "Product 1", price: "$120", image: "Image" },
        { id: 8, name: "Product 2", price: "$220", image: "Image" },
        { id: 9, name: "Product 3", price: "$320", image: "Image" },
      ],
      onViewAll: () => console.log("View all new products"),
    },
  ];

  const handleProductClick = (product) => {
    console.log("Clicked product:", product);
  };

  return (
    <div className="admindashboard-addproduct-container">
      {sections.map((section, idx) => (
        <div className="admindashboard-addproduct-card" key={idx}>
          <ProductSectionHeader
            title={section.title}
            onViewAll={section.onViewAll}
          />

          {section.subtitle && (
            <p className="admindashboard-card-subtitle">{section.subtitle}</p>
          )}

          {section.products.slice(0, 3).map((product) => (
            <div
              className="admindashboard-product-info"
              key={product.id}
              onClick={() => handleProductClick(product)}
            >
              <div className="admindashboard-product-image">
                {product.image}
              </div>
              <div>
                <p className="admindashboard-product-name">{product.name}</p>
                <p className="admindashboard-product-price">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AddProduct;
