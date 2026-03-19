import Order from "../../models/order.model.js";

export const getAllOrdersService = async (filters = {}) => {
  return await Order.find(filters)
    .populate("userId", "email username")
    .sort({ createdAt: -1 });
};

export const updateOrderStatusService = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");
  order.orderStatus = status;
  order.updatedAt = new Date();
  await order.save();
  return order;
};
