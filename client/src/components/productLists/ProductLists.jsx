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
import {
  getoffersService,
  searchProducts,
} from "../../api/userServices/userDashboard";
import presentToast from "../../components/Toast/Toast";
import "./productLists.css";
import Footer from "../footer/Footer";

const ProductLists = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const category = location?.state?.category || "";
  const type = location?.state?.type || null;
  const searchQuery = new URLSearchParams(location.search).get("search");

  const [products, setProducts] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [category, type, searchQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        // 🔍 SEARCH BRANCH (NEW) - No changes to existing logic below
        if (searchQuery) {
          const res = await searchProducts(searchQuery);
          console.log(res, "res");
          if (res.success) {
            setProducts(res.products || []);
            setTotal(res.products?.length || 0);
            setTotalPages(1);
          } else {
            setProducts([]);
            setTotal(0);
            setTotalPages(0);
          }
          setLoading(false);
          return;
        }

        // ========== EXISTING CODE (UNCHANGED) ==========
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
  }, [category, type, page, limit, searchQuery]);

  const handleProductClick = (product) => {
    let productCategory = product.category;

    if (!productCategory) {
      if (
        category === "Pants" ||
        category === "Shirts" ||
        category === "Footwear" ||
        category === "Accessories"
      ) {
        productCategory = category;
      } else {
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
      {searchQuery && products.length === 0 && !loading && (
        <h2
          style={{
            textAlign: "center",
            margin: "20px 0",
            padding: "150px 12px 20px 12px",
          }}
        >
          No results found for "{searchQuery}"
        </h2>
      )}
      <div className="product-list-container">
        {/* Search result heading (optional) */}
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

      {/* Only show pagination for non-search results */}
      {!searchQuery && totalPages > 1 && (
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
      <Footer />
    </div>
  );
};

export default ProductLists;
