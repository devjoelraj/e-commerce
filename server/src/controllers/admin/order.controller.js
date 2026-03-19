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

    console.log("📥 [updateOrderStatus] Request received");
    console.log("   orderId:", orderId);
    console.log("   status:", status);
    console.log("   emailMessage provided:", !!emailMessage);

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

    // Fetch the order
    const order = await Order.findById(orderId);
    if (!order) {
      console.log("❌ Order not found:", orderId);
      throw new Error("Order not found");
    }
    console.log("✅ Order found, current status:", order.orderStatus);

    // If cancelling, restore stock first
    if (status === "cancelled" && order.orderStatus !== "cancelled") {
      console.log("🔄 Restoring stock for order:", orderId);
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
            { _id: item.productId, "colors.name": item.color },
            { $inc: { "colors.$.qty": item.quantity } },
          );
        }

        if (updateResult.modifiedCount === 0) {
          throw new Error(`Failed to restore stock for ${product.productName}`);
        }
      }
      console.log("✅ Stock restored");
    }

    // Update order status
    const updatedOrder = await updateOrderStatusService(orderId, status);
    console.log("✅ Order status updated to:", updatedOrder.orderStatus);

    // If cancelled and email message provided, send email
    if (status === "cancelled" && emailMessage) {
      console.log("📧 Attempting to send cancellation email...");
      await updatedOrder.populate("userId", "email");
      const userEmail = updatedOrder.userId?.email;
      console.log("   User email from DB:", userEmail || "NOT FOUND");

      if (userEmail) {
        try {
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
          console.log("✅ Email sent successfully to:", userEmail);
        } catch (emailError) {
          console.error("❌ Email sending failed:", emailError);
          // Optionally, you could still return success for the order cancellation,
          // but log the email failure.
        }
      } else {
        console.warn(
          "⚠️ No user email found – cannot send cancellation email.",
        );
      }
    } else {
      console.log(
        "⏭️ Skipping email – status not cancelled or no email message.",
      );
    }

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("❌ Error in updateOrderStatus:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
