import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCards from "../productCards/ProductCards";
import Header from "../header/userHeader/Header";
import { getPantsProductsService } from "../../api/userServices/productsServices";
import "./productLists.css";

const ProductLists = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const category = location?.state?.category || "";

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (category === "Pants") {
          const response = await getPantsProductsService();
          if (response?.success) {
            setProducts(response.data);
          }
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
