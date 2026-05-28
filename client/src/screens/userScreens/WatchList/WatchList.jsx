import React, { useEffect, useState } from "react";
import ProductCards from "../../../components/productCards/ProductCards";
import Header from "../../../components/header/userHeader/Header";
import { getWatchlistService } from "../../../api/userServices/productsServices";
import ProductListSkeleton from "../../../components/loading/productListSkeletion";
import { IoIosHeartEmpty } from "react-icons/io";
import Footer from "../../../components/footer/Footer";
const WatchList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      setLoading(true);
      const res = await getWatchlistService();
      console.log(res);
      if (res?.success) {
        setProducts(res.data || []);
      }
      setLoading(false);
    };
    fetchWatchlist();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <ProductListSkeleton />;
    }
    if (products.length === 0) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "50vh",
            textAlign: "center",
          }}
        >
          <IoIosHeartEmpty size={64} color="#ccc" />
          <h3>Your watchlist is empty</h3>
          <p>Save items you like to see them here.</p>
        </div>
      );
    }
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "16px",
        }}
      >
        {products.map((product) => (
          <ProductCards
            key={product._id}
            productId={product._id}
            category={product.category}
            productname={product.productName}
            actualValue={product.pricing?.discountPrice}
            discountValue={product.pricing?.basePrice}
            image={product.colors?.[0]?.images?.[0]?.imageUrl}
            isWishlisted={true}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div style={{ padding: "100px 20px" }}>{renderContent()}</div>
      <Footer />
    </>
  );
};

export default WatchList;
