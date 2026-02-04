import React, { useEffect, useRef } from "react";
import "./UserDashBoard.css";
import Header from "../../../components/header/userHeader/Header";
import Footer from "../../../components/footer/Footer";
import ProductCards from "../../../components/productCards/ProductCards";
import { FaTshirt } from "react-icons/fa";
import {
  GiArmoredPants,
  GiConverseShoe,
  GiDress,
  GiHighHeel,
} from "react-icons/gi";
import HomeCarousel from "./Carousel/Carousel";
import { useLocation, useNavigate } from "react-router-dom";

const categories = [
  { name: "Shirts", icon: <FaTshirt size={40} color="#8864f0" /> },
  { name: "Pants", icon: <GiArmoredPants size={40} color="#4caf50" /> },
  { name: "Heels", icon: <GiHighHeel size={40} color="#f06292" /> },
  { name: "Shoes", icon: <GiConverseShoe size={40} color="#3f51b5" /> },
  { name: "Skirts", icon: <GiDress size={40} color="#ff6f00" /> },
];
const UserDashBoard = () => {
  const dealsRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.scrollToDeals) {
      dealsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.state]);

  const scrollToDeals = () => {
    dealsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategoryNav = (category) => {
    navigate("/ProductLists", { state: { category } });
  };

  const renderingCategory = () => {
    return categories.map((category, index) => (
      <div
        key={index}
        className="category-item"
        onClick={() => handleCategoryNav(category.name)}
      >
        {category.icon}
        <p style={{ marginTop: 4 }}>{category.name}</p>
      </div>
    ));
  };

  return (
    <div>
      <Header scrollToDeals={scrollToDeals} />
      <div style={{ padding: "90px 0 0 0" }}>
        <HomeCarousel />
      </div>
      <div style={{ padding: 16 }}>
        <h3>Best selling products</h3>
        <div className="product-grid">
          <ProductCards />
          <ProductCards />
          <ProductCards />
          <ProductCards />
        </div>

        <h3 style={{ marginTop: "40px" }} ref={dealsRef}>
          Flash Deals
        </h3>
        <div className="flash-deals">
          <div className="card-wrapper">
            <ProductCards />
          </div>
          <div className="card-wrapper">
            <ProductCards />
          </div>
          <div className="card-wrapper">
            <ProductCards />
          </div>
          <div className="card-wrapper">
            <ProductCards />
          </div>
          <div className="card-wrapper">
            <ProductCards />
          </div>
          <div className="card-wrapper">
            <ProductCards />
          </div>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <h3>Browse By Category</h3>
        <div className="icon-grid">{renderingCategory()}</div>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashBoard;
