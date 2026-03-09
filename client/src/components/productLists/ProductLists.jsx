import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCards from "../productCards/ProductCards";
import Header from "../header/userHeader/Header";
import { getPantsProductsService } from "../../api/userServices/productsServices";
import "./productLists.css";
import {
  getFootwearProductsService,
  getShirtsProductsService,
} from "../../api/userServices/userDashboard";

const ProductLists = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const category = location?.state?.category || "";

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;
        if (category === "Pants") {
          response = await getPantsProductsService();
        } else if (category === "Shirts") {
          response = await getShirtsProductsService();
        } else if (category === "Shoes" || category === "Slippers") {
          const type = category === "Shoes" ? "shoe" : "slipper";
          response = await getFootwearProductsService(type);
        } else {
          setProducts([]);
          return;
        }

        if (response?.success) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [category]);

  const handleProductClick = (product) => {
    navigate(`/ProductDetails/${product._id}`, { state: { product } });
  };

  return (
    <div>
      <Header />
      <div className="product-list-container">
        {products.map((product) => (
          <ProductCards
            key={product._id}
            productname={product.productName}
            actualValue={product.pricing.discountPrice}
            discountValue={product.pricing.basePrice}
            image={product.colors?.[0]?.images?.[0]?.imageUrl}
            onClick={() => handleProductClick(product)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductLists;
