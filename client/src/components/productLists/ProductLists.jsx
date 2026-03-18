import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pagination } from "antd";
import ProductCards from "../productCards/ProductCards";
import Header from "../header/userHeader/Header";
import ProductListSkeleton from "../loading/productListSkeletion";
import {
  getAccessoriesProductsService,
  getAllproductsService,
  getFootwearProductsService,
  getPantsProductsService,
  getShirtsProductsService,
  getWatchlistService,
} from "../../api/userServices/productsServices";
import { getoffersService } from "../../api/userServices/userDashboard";
import presentToast from "../../components/Toast/Toast"; // 👈 add this import
import "./productLists.css";

const ProductLists = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const category = location?.state?.category || "";
  const type = location?.state?.type || null;

  const [products, setProducts] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState([]);
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
        let productPromise;

        if (category === "Pants") {
          productPromise = getPantsProductsService(page, limit);
        } else if (category === "Shirts") {
          productPromise = getShirtsProductsService(page, limit);
        } else if (category === "Deals") {
          productPromise = getoffersService();
        } else if (category === "All") {
          productPromise = getAllproductsService(page, limit);
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
          productPromise = getFootwearProductsService(
            footwearType,
            page,
            limit,
          );
        } else if (category === "Accessories") {
          productPromise = getAccessoriesProductsService(type, page, limit);
        } else {
          setProducts([]);
          setLoading(false);
          return;
        }

        const [productRes, watchlistRes] = await Promise.all([
          productPromise,
          getWatchlistService(),
        ]);

        // ---------- Process products with category ----------
        if (productRes?.success) {
          let fetchedProducts = productRes.products || [];

          // Add category for specific lists that don't return it
          if (category === "Pants") {
            fetchedProducts = fetchedProducts.map((p) => ({
              ...p,
              category: "Pants",
            }));
          } else if (category === "Shirts") {
            fetchedProducts = fetchedProducts.map((p) => ({
              ...p,
              category: "Shirts",
            }));
          } else if (
            category === "Footwear" ||
            category === "Shoes" ||
            category === "Slippers"
          ) {
            fetchedProducts = fetchedProducts.map((p) => ({
              ...p,
              category: "Footwear",
            }));
          } else if (category === "Accessories") {
            fetchedProducts = fetchedProducts.map((p) => ({
              ...p,
              category: "Accessories",
            }));
          }
          // For "All", we assume backend returns category (if not, we handle later)

          setProducts(fetchedProducts);
          setTotal(productRes.total || 0);
          setTotalPages(productRes.totalPages || 0);
        }

        // ---------- Watchlist IDs ----------
        if (watchlistRes?.success) {
          const ids = watchlistRes.data.map((item) => item._id);
          setWatchlistIds(ids);
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
    // Determine the category to use for routing
    let productCategory = product.category;

    // If product.category is missing, try to infer from outer category (for Pants/Shirts lists)
    if (!productCategory) {
      if (
        category === "Pants" ||
        category === "Shirts" ||
        category === "Footwear" ||
        category === "Accessories"
      ) {
        productCategory = category; // use the outer category
      } else {
        // For "All" list, we cannot guess; show error
        console.error("Product category missing for product:", product);
        presentToast.error("Product category missing. Cannot navigate.");
        return;
      }
    }

    const routeMap = {
      Pants: "pants",
      Shirts: "shirts",
      Footwear: "footwear",
      Accessories: "accessories",
    };

    const routeCategory =
      routeMap[productCategory] || productCategory.toLowerCase();

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
              productId={product._id}
              category={product.category || category} // fallback for display
              productname={product.productName}
              actualValue={product.pricing?.discountPrice}
              discountValue={product.pricing?.basePrice}
              image={product.colors?.[0]?.images?.[0]?.imageUrl}
              isWishlisted={watchlistIds.includes(product._id)}
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
