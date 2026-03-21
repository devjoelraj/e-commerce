import { reduceStockService } from "../services/admin/stock.service.js";

export const reduceStock = async (req, res) => {
  try {
    const { productId, category, color, size, quantity } = req.body;

    if (!productId || !category || !color || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const product = await reduceStockService({
      productId,
      category,
      color,
      size,
      quantity,
    });

    res.json({ success: true, message: "Stock reduced successfully", product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
