import apiClient from "../apiClient";
export const postSildersContentService = async (bodyContent) => {
  try {
    const response = await apiClient.post("/admin/slidersUpload", bodyContent);
    if (response?.status === 201) {
      return response?.data;
    }
    return { success: false, message: "Failed to upload slider content" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
export const deleteSildersContentService = async (id) => {
  try {
    const response = await apiClient.delete(`/admin/slidersUpload/${id}`);
    if (response?.status === 201) {
      return response?.data;
    }
    return { success: false, message: "Failed to delete slider" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
export const reorderSildersContentService = async (bodyContent) => {
  try {
    const response = await apiClient.put(
      "/admin/slidersUpload/reorder",
      bodyContent,
    );
    if (response?.status === 201) {
      return response?.data;
    }
    return { success: false, message: "Failed to reorder sliders" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const postPantsProductService = async (bodyContent) => {
  try {
    const response = await apiClient.post("/admin/pantsUpload", bodyContent);
    if (response?.status === 201) {
      return response?.data;
    }
    return { success: false, message: "Failed to upload pants product" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updatePantsProductService = async (id, bodyContent) => {
  try {
    const response = await apiClient.put(`/admin/pants/${id}`, bodyContent);
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to update pants product" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
