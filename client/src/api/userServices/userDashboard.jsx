import apiClient from "../apiClient";

export const getSilderService = async () => {
  try {
    const response = await apiClient.get("/admin/slidersUpload");
    if (response?.status === 201) {
      return response?.data;
    }
    return { success: false, message: "Failed to get Silders data" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
