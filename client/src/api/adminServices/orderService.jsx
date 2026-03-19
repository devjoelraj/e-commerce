import apiClient from "../apiClient.jsx";

export const getAllOrders = async () => {
  try {
    const response = await apiClient.get("/admin/orders");
    if (response?.status === 200) {
      return response.data;
    }
    return { success: false, message: "Failed to get all products" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await apiClient.put(`/admin/orders/${orderId}/status`, {
      status,
    });
    if (response?.status === 200) {
      return response.data;
    }
    return { success: false, message: "Failed to get all products" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
