import React from "react";
import { FaPlus } from "react-icons/fa";
import "./AddProduct.css";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Dashboard Slider",
      subtitle: "Image upload",
      onAdd: () => navigate("/admin/DashboardSilders"),
    },
    {
      title: "New Products",
      subtitle: "",
      onAdd: () => navigate("/admin/upload-product-details"),
    },
    {
      title: "Offers Products",
      subtitle: "",
      onAdd: () => navigate("/admin/add-offer-product"),
    },
  ];

  return (
    <div className="admindashboard-addproduct-container">
      {cards.map((card, index) => (
        <div key={index} className="admindashboard-addproduct-card">
          <div className="admindashboard-card-header">
            <h3>{card.title}</h3>
            <div className="admindashboard-header-actions">
              <FaPlus
                className="admindashboard-add-icon"
                onClick={card.onAdd}
              />
            </div>
          </div>

          {card.subtitle && (
            <p className="admindashboard-card-subtitle">{card.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AddProduct;
