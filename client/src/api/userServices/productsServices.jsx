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
