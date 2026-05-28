import apiClient from "../apiClient";
export const reduceStock = async (data) => {
  try {
    const response = await apiClient.post("/admin/stock/reduce", data);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
