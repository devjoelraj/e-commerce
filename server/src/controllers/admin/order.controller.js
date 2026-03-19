import {
  getAllOrdersService,
  updateOrderStatusService,
} from "../../services/admin/getOrder.service.js";
import { sendEmail } from "../../utils/email.utils.js";
import Order from "../../models/order.model.js";
import { getProductModel } from "../../utils/productHelpers.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrdersService();
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, emailMessage } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    if (status === "cancelled" && order.orderStatus !== "cancelled") {
      for (const item of order.items) {
        const Model = getProductModel(item.category);
        const product = await Model.findById(item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);

        const colorObj = product.colors.find((c) => c.name === item.color);
        if (!colorObj) throw new Error(`Color ${item.color} not found`);

        let updateResult;
        if (item.category !== "Accessories") {
          if (!item.size) throw new Error("Size missing");
          updateResult = await Model.updateOne(
            {
              _id: item.productId,
              "colors.name": item.color,
              "colors.sizes.size": item.size,
            },
            {
              $inc: { "colors.$[color].sizes.$[size].qty": item.quantity },
            },
            {
              arrayFilters: [
                { "color.name": item.color },
                { "size.size": item.size },
              ],
            },
          );
        } else {
          updateResult = await Model.updateOne(
            {
              _id: item.productId,
              "colors.name": item.color,
            },
            {
              $inc: { "colors.$.qty": item.quantity },
            },
          );
        }

        if (updateResult.modifiedCount === 0) {
          throw new Error(`Failed to restore stock for ${product.productName}`);
        }
      }
    }

    // Now update the order status
    const updatedOrder = await updateOrderStatusService(orderId, status);

    // If cancelled and email provided, send email
    if (status === "cancelled" && emailMessage) {
      await updatedOrder.populate("userId", "email");
      const userEmail = updatedOrder.userId?.email;
      if (userEmail) {
        await sendEmail({
          to: userEmail,
          subject: "Your Order Has Been Cancelled",
          html: `
            <h3>Order Cancellation</h3>
            <p>Your order #${updatedOrder._id} has been cancelled.</p>
            <p>Message from the seller:</p>
            <p>${emailMessage}</p>
            <p>If you have any questions, please contact support.</p>
          `,
        });
      }
    }

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
