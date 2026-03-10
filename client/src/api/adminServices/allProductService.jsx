import apiClient from "../apiClient";

export const getAllProductService = async () => {
  try {
    const response = await apiClient("/admin/allProducts");
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to get all products" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteProductService = async (bodyContent) => {
  try {
    const response = await apiClient.post("/admin/deleteProduct", bodyContent);
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to delete the product" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
