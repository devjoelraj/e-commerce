import apiClient from "../apiClient";

export const getPantsProductsService = async () => {
  try {
    const response = await apiClient.get("/admin/pants");
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to fetch pants products" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getPantsProductByIdService = async (id) => {
  try {
    const response = await apiClient.get(`/user/product/${id}`);
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to fetch pants product" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getAccessoriesProductsService = async (type = null) => {
  try {
    const params = type ? { type } : {};
    const response = await apiClient.get("/admin/accessories", { params });
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to fetch accessories products" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getShirtsProductsService = async (params = {}) => {
  try {
    const response = await apiClient.get("/admin/shirts", { params });
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to fetch shirts products" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getFootwearProductsService = async (type = null) => {
  try {
    const params = type ? { type } : {};
    const response = await apiClient.get("/admin/shoes", { params });
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to fetch footwear products" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getAllproductsService = async () => {
  try {
    const response = await apiClient.get("/admin/allProducts");
    if (response?.status === 200) {
      return response?.data;
    } else {
      return { success: false, message: "Failed to fetch products" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};
