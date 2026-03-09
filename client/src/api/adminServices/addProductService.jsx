import apiClient from "../apiClient";

//silder

export const postSildersContentService = async (bodyContent) => {
  try {
    const response = await apiClient.post("/admin/sliderUpload", bodyContent);
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
    const response = await apiClient.delete(`/admin/sliderUpload/${id}`);
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to delete slider" };
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

//pants

// export const updatePantsProductService = async (id, bodyContent) => {
//   try {
//     const response = await apiClient.put(`/admin/pants/${id}`, bodyContent);
//     if (response?.status === 200) {
//       return response?.data;
//     }
//     return { success: false, message: "Failed to update pants product" };
//   } catch (error) {
//     return { success: false, message: error.message };
//   }
// };

export const addExistingPantsVariantService = async (id, bodyContent) => {
  try {
    const response = await apiClient.post(
      `/admin/pants/colorVariant/${id}`,
      bodyContent,
    );
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to add color variant" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

//shirts

export const postShirtsProductService = async (bodyContent) => {
  try {
    const response = await apiClient.post("/admin/shirtsUpload", bodyContent);
    if (response?.status === 201) {
      return response?.data;
    }
    return { success: false, message: "Failed to upload shirts product" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// export const updateShirtsProductService = async (id, bodyContent) => {
//   try {
//     const response = await apiClient.put(`/admin/shirts/${id}`, bodyContent);
//     if (response?.status === 200) {
//       return response?.data;
//     }
//     return { success: false, message: "Failed to update shirts product" };
//   } catch (error) {
//     return { success: false, message: error.message };
//   }
// };

export const addExistingShirtsVariantService = async (id, bodyContent) => {
  try {
    const response = await apiClient.post(
      `/admin/shirts/colorVariant/${id}`,
      bodyContent,
    );
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to add color variant" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
// ========== Footwear Services ==========

export const postFootwearProductService = async (bodyContent) => {
  try {
    const response = await apiClient.post("/admin/shoesUpload", bodyContent);
    if (response?.status === 201) {
      return response?.data;
    }
    return { success: false, message: "Failed to upload footwear product" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const addExistingFootwearVariantService = async (id, bodyContent) => {
  try {
    const response = await apiClient.post(
      `/admin/shoes/colorVariant/${id}`,
      bodyContent,
    );
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to add color variant" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
export const deleteFootwearProductService = async (payload) => {
  try {
    const response = await apiClient.post("/admin/shoes/delete", payload);
    if (response?.status === 200) {
      return response?.data;
    }
    return {
      success: false,
      message: "Failed to delete footwear product/image",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ========== Accessories Services ==========

export const postAccessoriesProductService = async (bodyContent) => {
  try {
    const response = await apiClient.post(
      "/admin/accessoriesUpload",
      bodyContent,
    );
    if (response?.status === 201) {
      return response?.data;
    }
    return { success: false, message: "Failed to upload accessories product" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const addExistingAccessoriesVariantService = async (id, bodyContent) => {
  try {
    const response = await apiClient.post(
      `/admin/accessories/colorVariant/${id}`,
      bodyContent,
    );
    if (response?.status === 200) {
      return response?.data;
    }
    return { success: false, message: "Failed to add color variant" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteAccessoriesProductService = async (payload) => {
  try {
    const response = await apiClient.post("/admin/accessories/delete", payload);
    if (response?.status === 200) {
      return response?.data;
    }
    return {
      success: false,
      message: "Failed to delete accessories product/image",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
