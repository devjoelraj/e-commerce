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
