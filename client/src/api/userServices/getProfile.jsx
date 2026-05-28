import apiClient from "../apiClient";

export const getUserProfile = async () => {
  try {
    const response = await apiClient.get("/user/getprofile");
    if (response?.status === 200) {
      return response.data;
    }
    return { success: false, message: "Failed to fetch profile" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const cancelOrder = async (orderId, reason) => {
  try {
    const response = await apiClient.post(`/user/profile/cancel/${orderId}`, {
      reason,
    });
    if (response?.status === 200) {
      return response.data;
    }
    return { success: false, message: "Failed to cancel order" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const logoutService = async () => {
  try {
    const response = await apiClient.post("/auth/logout");
    if (response?.status === 200) {
      return response.data;
    }
    return { success: false, message: "Failed to login" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
