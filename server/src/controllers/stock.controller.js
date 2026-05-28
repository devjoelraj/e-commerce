import { reduceStockService } from "../services/admin/stock.service.js";

export const reduceStock = async (req, res) => {
  try {
    const { productId, category, color, size, quantity, sellingPrice } =
      req.body;
    const adminId = req.user.userId;

    if (!productId || !category || !color || !quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Missing or invalid fields" });
    }
    if (category !== "Accessories" && !size) {
      return res
        .status(400)
        .json({ success: false, message: "Size required for this category" });
    }

    const product = await reduceStockService({
      productId,
      category,
      color,
      size,
      quantity,
      adminId,
      sellingPrice: sellingPrice ? parseFloat(sellingPrice) : undefined,
    });

    res.json({
      success: true,
      message: "Stock reduced and offline sale recorded",
      product,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
