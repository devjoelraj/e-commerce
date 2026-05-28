import { getAllOrdersService } from "../../services/admin/getOrder.service.js";
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

/**
 * Helper function to restore stock for a cancelled order
 */
async function restoreOrderStock(order) {
  for (const item of order.items) {
    const Model = getProductModel(item.category);
    const product = await Model.findById(item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);

    const colorObj = product.colors.find((c) => c.name === item.color);
    if (!colorObj) throw new Error(`Color ${item.color} not found`);

    if (item.category !== "Accessories") {
      if (!item.size) throw new Error("Size missing");
      await Model.updateOne(
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
      await Model.updateOne(
        { _id: item.productId, "colors.name": item.color },
        { $inc: { "colors.$.qty": item.quantity } },
      );
    }
  }
}

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

    let allowedPreviousStatuses;
    if (status === "shipped") {
      allowedPreviousStatuses = ["pending"];
    } else if (status === "cancelled") {
      allowedPreviousStatuses = ["pending", "confirmed", "shipped"];
    } else {
      allowedPreviousStatuses = ["pending", "confirmed", "shipped"];
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, orderStatus: { $in: allowedPreviousStatuses } },
      { orderStatus: status, updatedAt: new Date() },
      { new: true },
    );

    if (!updatedOrder) {
      return res.status(400).json({
        success: false,
        message:
          "Order cannot be updated (already processed or invalid status transition)",
      });
    }

    console.log("✅ Order status updated to:", updatedOrder.orderStatus);

    if (status === "cancelled") {
      try {
        await restoreOrderStock(updatedOrder);
        console.log("✅ Stock restored for cancelled order");
      } catch (stockError) {
        console.error("❌ Stock restoration failed:", stockError);
      }

      if (emailMessage) {
        console.log("📧 Attempting to send cancellation email...");
        await updatedOrder.populate("userId", "email");
        const userEmail = updatedOrder.userId?.email;
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
          }
        } else {
          console.warn(
            "⚠️ No user email found – cannot send cancellation email.",
          );
        }
      }
    }

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("❌ Error in updateOrderStatus:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
