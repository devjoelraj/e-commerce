import apiClient from "../apiClient";

export const getCartService = async () => {
  try {
    const res = await apiClient.get("/user/cart");
    if (res?.status === 200) {
      return res?.data;
    }
    return { success: false, message: "Failed to fetch add to cart products" };
  } catch (err) {
    return { success: false, message: "Failed to fetch add to cart products" };
  }
};

export const updateCartService = async (data) => {
  try {
    const res = await apiClient.put("/user/cart/update", data);
    if (res?.status === 200) {
      return res?.data;
    }
    return { success: false, message: "Failed to update cart item" };
  } catch (err) {
    return { success: false, message: "Failed to update cart item" };
  }
};

export const removeCartItemService = async (data) => {
  try {
    const res = await apiClient.delete("/user/cart/remove", {
      data,
    });
    if (res?.status === 200) {
      return res?.data;
    }
    return { success: false, message: "Failed to remove cart item" };
  } catch (err) {
    return { success: false, message: "Failed to remove cart item" };
  }
};

export const addToCartService = async (data) => {
  try {
    const res = await apiClient.post("/user/addtocart", data);
    if (res?.status === 200) {
      return res?.data;
    }
    return { success: false, message: "Failed to add item to cart" };
  } catch (err) {
    return { success: false, message: "Failed to add item to cart" };
  }
};
