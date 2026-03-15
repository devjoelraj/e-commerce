import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pagination } from "antd";
import ProductCards from "../productCards/ProductCards";
import Header from "../header/userHeader/Header";
import {
  getAccessoriesProductsService,
  getAllproductsService,
  getFootwearProductsService,
  getPantsProductsService,
  getShirtsProductsService,
} from "../../api/userServices/productsServices";
import { getoffersService } from "../../api/userServices/userDashboard";
import ProductListSkeleton from "../loading/productListSkeletion";
import "./productLists.css";

const ProductLists = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const category = location?.state?.category || "";
  const type = location?.state?.type || null;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [category, type]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let response;

        if (category === "Pants") {
          response = await getPantsProductsService(page, limit);
        } else if (category === "Shirts") {
          response = await getShirtsProductsService(page, limit);
        } else if (category === "Deals") {
          response = await getoffersService();
        } else if (category === "All") {
          response = await getAllproductsService(page, limit);
        } else if (
          category === "Shoes" ||
          category === "Slippers" ||
          category === "Footwear"
        ) {
          const footwearType =
            type ||
            (category === "Shoes"
              ? "shoe"
              : category === "Slippers"
                ? "slipper"
                : null);
          response = await getFootwearProductsService(
            footwearType,
            page,
            limit,
          );
        } else if (category === "Accessories") {
          response = await getAccessoriesProductsService(type, page, limit);
        } else {
          setProducts([]);
          return;
        }

        if (response?.success) {
          setProducts(response.products || []);
          setTotal(response.total || 0);
          setTotalPages(response.totalPages || 0);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, type, page, limit]);

  const handleProductClick = (product) => {
    const routeMap = {
      Pants: "pants",
      Shirts: "shirts",
      Shoes: "footwear",
      Slippers: "footwear",
      Footwear: "footwear",
      Accessories: "accessories",
    };
    const routeCategory = routeMap[category] || category.toLowerCase();
    navigate(`/product/${routeCategory}/${product._id}`, {
      state: { product },
    });
  };

  return (
    <div>
      <Header />
      <div className="product-list-container">
        {loading ? (
          <ProductListSkeleton />
        ) : (
          products.map((product) => (
            <ProductCards
              key={product._id}
              productname={product.productName}
              actualValue={product.pricing?.discountPrice}
              discountValue={product.pricing?.basePrice}
              image={product.colors?.[0]?.images?.[0]?.imageUrl}
              onClick={() => handleProductClick(product)}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px 0",
          }}
        >
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            onChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            showSizeChanger={false}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
};

export default ProductLists;
