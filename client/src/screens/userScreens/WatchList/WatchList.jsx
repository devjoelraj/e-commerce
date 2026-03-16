import React, { useEffect, useState } from "react";
import ProductCards from "../../../components/productCards/ProductCards";
import Header from "../../../components/header/userHeader/Header";
import { getWatchlistService } from "../../../api/userServices/productsServices";
import ProductListSkeleton from "../../../components/loading/productListSkeletion";

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

  return (
    <>
      <Header />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "16px",
          padding: "100px 20px",
        }}
      >
        {loading ? (
          <ProductListSkeleton />
        ) : (
          products.map((product) => (
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
          ))
        )}
      </div>
    </>
  );
};

export default WatchList;
