import {
  addToCartService,
  getCartService,
  removeFromCartService,
  updateCartQuantityService,
} from "../../services/user/cart.service.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, category, color, size, quantity } = req.body;

    const cart = await addToCartService({
      userId,
      productId,
      category,
      color,
      size,
      quantity,
    });

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, category, color, size } = req.body;

    const cart = await removeFromCartService({
      userId,
      productId,
      category,
      color,
      size,
    });

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, category, color, size, newQuantity } = req.body;

    const cart = await updateCartQuantityService({
      userId,
      productId,
      category,
      color,
      size,
      newQuantity,
    });

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await getCartService(userId);

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
