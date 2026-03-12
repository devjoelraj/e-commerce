import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCards from "../productCards/ProductCards";
import Header from "../header/userHeader/Header";
import {
  getAccessoriesProductsService,
  getFootwearProductsService,
  getPantsProductsService,
  getShirtsProductsService,
} from "../../api/userServices/productsServices";
import "./productLists.css";
import ProductListSkeleton from "../loading/productListSkeletion";
import { getoffersService } from "../../api/userServices/userDashboard";

const ProductLists = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const category = location?.state?.category || "";
  const type = location?.state?.type || null;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        let response;
        if (category === "Pants") {
          response = await getPantsProductsService();
        } else if (category === "Shirts") {
          response = await getShirtsProductsService();
        } else if (category === "Deals") {
          response = await getoffersService();
          console.log(response);
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

          response = await getFootwearProductsService(footwearType);
        } else if (category === "Accessories") {
          response = await getAccessoriesProductsService(type);
          console.log(response);
        } else {
          setProducts([]);
          return;
        }

        if (response?.success) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, type]);

  const handleProductClick = (product) => {
    const routeMap = {
      Pants: "pants",
      Shirts: "shirts",
      Shoes: "footwear",
      Slippers: "footwear",
      Footwear: "footwear",
      Accessories: "accessories",
    };

    const routeCategory = routeMap[category];

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
              actualValue={product.pricing.discountPrice}
              discountValue={product.pricing.basePrice}
              image={product.colors?.[0]?.images?.[0]?.imageUrl}
              onClick={() => handleProductClick(product)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductLists;
