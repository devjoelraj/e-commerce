import React, { useEffect, useRef, useState } from "react";
import "./userDashBoard.css";
import Header from "../../../components/header/userHeader/Header";
import Footer from "../../../components/footer/Footer";
import ProductCards from "../../../components/productCards/ProductCards";
import { FaTshirt } from "react-icons/fa";
import {
  GiArmoredPants,
  GiConverseShoe,
  GiFlipFlops,
  GiWatch,
} from "react-icons/gi";
import HomeCarousel from "./Carousel/Carousel";
import { useLocation, useNavigate } from "react-router-dom";
import { getoffersService } from "../../../api/userServices/userDashboard";
import {
  addToWatchlistService,
  removeFromWatchlistService,
  getWatchlistService,
} from "../../../api/userServices/productsServices";
import { getTopProducts } from "../../../api/adminServices/dashboardService"; // adjust path
import ProductListSkeleton from "../../../components/loading/productListSkeletion";

const categories = [
  { name: "Shirts", icon: <FaTshirt size={40} color="#8864f0" /> },
  { name: "Pants", icon: <GiArmoredPants size={40} color="#4caf50" /> },
  { name: "Shoes", icon: <GiConverseShoe size={40} color="#3f51b5" /> },
  { name: "Slippers", icon: <GiFlipFlops size={40} color="#3f51b5" /> },
  { name: "Accessories", icon: <GiWatch size={40} color="#3f51b5" /> },
];

const UserDashBoard = () => {
  const dealsRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [offersProducts, setOffersProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTop, setLoadingTop] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchTopProducts();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [offerRes, watchlistRes] = await Promise.all([
        getoffersService(4),
        getWatchlistService(),
      ]);
      console.log(offerRes, "offer");
      if (offerRes?.success) {
        setOffersProducts(offerRes.products || []);
      }

      if (watchlistRes?.success) {
        const ids = watchlistRes.data.map((item) => item._id);
        setWatchlistIds(ids);
      }
    } catch (error) {
      console.log("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const res = await getTopProducts(5);
      console.log(res, "top");
      if (res.success) {
        setTopProducts(res.products);
      } else {
        console.warn("Failed to fetch top products:", res.message);
      }
    } catch (error) {
      console.error("Error fetching top products:", error);
    } finally {
      setLoadingTop(false);
    }
  };

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

  const handleToggleWatchlist = async (productId, category, isWishlisted) => {
    try {
      if (isWishlisted) {
        const res = await removeFromWatchlistService(productId, category);
        if (res?.success) {
          setWatchlistIds((prev) => prev.filter((id) => id !== productId));
        }
      } else {
        const res = await addToWatchlistService(productId, category);
        if (res?.success) {
          setWatchlistIds((prev) => [...prev, productId]);
        }
      }
    } catch (error) {
      console.log("Watchlist error:", error);
    }
  };

  return (
    <div>
      <Header scrollToDeals={scrollToDeals} />

      <div style={{ padding: "90px 0 0 0" }}>
        <HomeCarousel />
      </div>

      <div style={{ padding: 16 }}>
        <h3>Best selling products</h3>

        <div className="flash-deals">
          {loadingTop ? (
            <ProductListSkeleton count={5} />
          ) : (
            topProducts.map((product) => (
              <div className="card-wrapper" key={product._id}>
                <ProductCards
                  productId={product._id}
                  category={product.category}
                  productname={product.productName}
                  actualValue={product.pricing?.discountPrice}
                  discountValue={product.pricing?.basePrice}
                  image={
                    product.colors?.[0]?.images?.[0]?.imageUrl ||
                    "https://via.placeholder.com/200"
                  }
                  isWishlisted={watchlistIds.includes(product._id)}
                  onToggleWatchlist={handleToggleWatchlist}
                  onClick={() =>
                    navigate(
                      `/product/${product.category?.toLowerCase()}/${product._id}`,
                      { state: { product } },
                    )
                  }
                />
              </div>
            ))
          )}
        </div>

        <div>
          <h3>Browse By Category</h3>
          <div className="flash-deals">{renderingCategory()}</div>
        </div>

        <h3 style={{ marginTop: "40px" }} ref={dealsRef}>
          Flash Deals
        </h3>

        <div className="flash-deals">
          {loading ? (
            <ProductListSkeleton count={4} />
          ) : (
            offersProducts.map((product) => (
              <div className="card-wrapper" key={product._id}>
                <ProductCards
                  productId={product._id}
                  category={
                    product.category === "footwear"
                      ? "Footwear"
                      : product.category
                  }
                  productname={product.productName}
                  actualValue={product.pricing.discountPrice}
                  discountValue={product.pricing.basePrice}
                  image={product.colors?.[0]?.images?.[0]?.imageUrl}
                  isWishlisted={watchlistIds.includes(product._id)}
                  onToggleWatchlist={handleToggleWatchlist}
                  onClick={() =>
                    navigate(
                      `/product/${product.category.toLowerCase()}/${product._id}`,
                      { state: { product } },
                    )
                  }
                />
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashBoard;
