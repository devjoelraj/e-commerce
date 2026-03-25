import apiClient from "../apiClient";

export const getSilderService = async () => {
  try {
    const response = await apiClient.get("/admin/sliderUpload");
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to get Silders data" };
  } catch (error) {
    return {
      success: false,
      message: "something went wrong try after some time",
    };
  }
};

export const getoffersService = async (limit = null) => {
  try {
    const url = limit ? `/user/offers?limit=${limit}` : "/user/offers";
    const response = await apiClient.get(url);
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to get Offers data" };
  } catch (error) {
    return {
      success: false,
      message: "something went wrong try after some time",
    };
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
    return {
      success: false,
      message: "something went wrong try after some time",
    };
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
    return {
      success: false,
      message: "something went wrong try after some time",
    };
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
    return {
      success: false,
      message: "something went wrong try after some time",
    };
  }
};
