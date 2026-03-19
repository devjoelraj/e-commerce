import User from "../../models/user.model.js";
import Order from "../../models/order.model.js";
import { getProductModel } from "../../utils/productHelpers.js";

export const getUserProfileService = async (userId) => {
  const user = await User.findById(userId).select("email username");
  if (!user) throw new Error("User not found");
  return user;
};

export const getActiveOrdersService = async (userId) => {
  // Active: not delivered and not cancelled
  const orders = await Order.find({
    userId,
    orderStatus: { $nin: ["delivered", "cancelled"] },
  }).sort({ createdAt: -1 });
  return orders;
};

export const getOrderHistoryService = async (userId) => {
  // History: delivered orders only
  const orders = await Order.find({
    userId,
    orderStatus: "delivered",
  }).sort({ createdAt: -1 });
  return orders;
};

export const cancelUserOrderService = async (userId, orderId, reason) => {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, userId, orderStatus: "pending" },
    {
      orderStatus: "cancelled",
      cancellationReason: reason,
      updatedAt: new Date(),
    },
    { new: true },
  );

  if (!order) {
    throw new Error("Order not found or already processed");
  }

  for (const item of order.items) {
    const Model = getProductModel(item.category);

    if (item.category !== "Accessories") {
      if (!item.size) throw new Error("Size missing");
      await Model.updateOne(
        {
          _id: item.productId,
          "colors.name": item.color,
          "colors.sizes.size": item.size,
        },
        { $inc: { "colors.$[color].sizes.$[size].qty": item.quantity } },
        {
          arrayFilters: [
            { "color.name": item.color },
            { "size.size": item.size },
          ],
        },
      );
    } else {
      await Model.updateOne(
        { _id: item.productId, "colors.name": item.color },
        { $inc: { "colors.$.qty": item.quantity } },
      );
    }
  }

  return order;
};
