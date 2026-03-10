import React, { useEffect, useState } from "react";
import "./AllProducts.css";
import {
  getAllProductService,
  deleteProductService,
} from "../../../api/adminServices/allProductService";
import ContinueButton from "../../../components/buttons/ContinueButton";
import presentToast from "../../../components/Toast/Toast";
import ConfirmModal from "../../../components/popUp/ConfirmModal";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setIsLoading(true);
      const response = await getAllProductService();
      if (response?.success) {
        setProducts(response?.data || []);
      } else {
        presentToast.error(response?.message || "Failed to fetch products");
      }
    } catch (error) {
      presentToast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    const { _id: productId, category } = selectedProduct;

    try {
      setDeleteLoadingId(productId);

      const response = await deleteProductService({
        productId,
        category,
      });
      console.log(response, "re");
      if (response?.success) {
        presentToast.success("Product deleted successfully");

        await fetchAllProducts();

        setShowDeleteModal(false);
        setSelectedProduct(null);
      } else {
        presentToast.error(response?.message || "Delete failed");
      }
    } catch (error) {
      presentToast.error("Delete failed");
      console.error(error);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  if (isLoading) {
    return <div className="loading-text">Loading products...</div>;
  }

  if (!isLoading && products.length === 0) {
    return <div className="no-products">No products found.</div>;
  }

  return (
    <div className="allproducts-container">
      <h2 className="allproducts-heading">All Products</h2>

      <table className="allproducts-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Total Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td className="product-name">{item.productName}</td>
              <td>{item.totalQuantity}</td>
              <td className="actions">
                <button className="edit-btn">Edit</button>
                <ContinueButton
                  text="Delete"
                  loading={deleteLoadingId === item._id}
                  onClick={() => {
                    setSelectedProduct(item);
                    setShowDeleteModal(true);
                  }}
                  style={{
                    backgroundColor: "#e74c3c",
                    padding: "6px 14px",
                    border: "none",
                    color: "white",
                    borderRadius: "6px",
                    fontSize: "13px",
                    cursor: "pointer",
                    width: "fit-content",
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        open={showDeleteModal}
        title="Delete Product"
        message={`Are you sure you want to delete ${selectedProduct?.productName}?`}
        loading={deleteLoadingId === selectedProduct?._id}
        confirmText="Delete"
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AllProducts;
