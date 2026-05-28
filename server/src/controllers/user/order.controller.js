import orderModel from "../../models/order.model.js";
import { placeOrderService } from "../../services/user/order.service.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { address, saveAddress } = req.body;

    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "Address is required" });
    }

    const order = await placeOrderService({
      userId,
      addressData: address,
      saveAddress: saveAddress || false,
    });

    res
      .status(201)
      .json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
