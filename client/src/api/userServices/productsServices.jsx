import apiClient from "../apiClient";

export const getPantsProductsService = async (page = 1, limit = 15) => {
  try {
    const response = await apiClient.get("/admin/pants", {
      params: { page, limit },
    });
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

export const getAccessoriesProductsService = async (
  type = null,
  page = 1,
  limit = 15,
) => {
  try {
    const params = { page, limit };
    if (type) params.type = type;
    const response = await apiClient.get("/admin/accessories", { params });
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
export const getShirtsProductsService = async (page = 1, limit = 15) => {
  try {
    const response = await apiClient.get("/admin/shirts", {
      params: { page, limit },
    });
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getFootwearProductsService = async (
  type = null,
  page = 1,
  limit = 15,
) => {
  try {
    const params = { page, limit };
    if (type) params.type = type;
    const response = await apiClient.get("/admin/shoes", { params });
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getAllproductsService = async (page = 1, limit = 15) => {
  try {
    const response = await apiClient.get("/user/Allproducts", {
      params: { page, limit },
    });
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
