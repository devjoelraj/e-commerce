import {
  getUserProfileService,
  getActiveOrdersService,
  getOrderHistoryService,
  cancelUserOrderService,
} from "../../services/user/profile.service.js";

export const getProfileData = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [user, activeOrders, orderHistory] = await Promise.all([
      getUserProfileService(userId),
      getActiveOrdersService(userId),
      getOrderHistoryService(userId),
    ]);

    res.json({
      success: true,
      user,
      activeOrders,
      orderHistory,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res
        .status(400)
        .json({ success: false, message: "Cancellation reason is required" });
    }

    const order = await cancelUserOrderService(userId, orderId, reason);
    res.json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
