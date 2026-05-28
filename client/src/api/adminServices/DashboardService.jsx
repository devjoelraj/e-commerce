import apiClient from "../apiClient";

export const getMonthlySalesData = async (months = 6) => {
  try {
    const res = await apiClient.get(`/admin/sales-monthly?months=${months}`);
    if (res?.status === 200) {
      return res.data;
    }
    return { success: false, message: "something went wrong" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const getTopProducts = async (limit = 5) => {
  try {
    const res = await apiClient.get(`/user/top-products?limit=${limit}`);
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
