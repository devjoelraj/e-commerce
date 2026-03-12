import apiClient from "../apiClient";

export const getSilderService = async () => {
  try {
    const response = await apiClient.get("/admin/sliderUpload");
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to get Silders data" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getoffersService = async () => {
  try {
    const response = await apiClient.get("/user/offers");
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to get Offers data" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
export const getShirtsProductByIdService = async (id) => {
  try {
    const response = await apiClient.get(`/admin/shirts/${id}`);
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to fetch shirts product" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getFootwearProductByIdService = async (id) => {
  try {
    const response = await apiClient.get(`/admin/footwear/${id}`);
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to fetch footwear product" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getAccessoriesProductByIdService = async (id) => {
  try {
    const response = await apiClient.get(`/admin/accessories/${id}`);
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to fetch accessories product" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
