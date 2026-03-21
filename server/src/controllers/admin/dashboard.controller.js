import {
  getMonthlySales,
  getMonthlySalesInRange,
  getTopProducts,
} from "../../services/admin/dashboard.service.js";

export const getMonthlySalesData = async (req, res) => {
  try {
    let { months, from, to } = req.query;

    // If custom date range provided, use it
    if (from && to) {
      const start = new Date(from);
      const end = new Date(to);
      if (isNaN(start) || isNaN(end)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid date range" });
      }
      const data = await getMonthlySalesInRange(start, end);
      return res.json({ success: true, data });
    }

    // Otherwise, use months parameter
    let monthsCount = parseInt(months);
    if (isNaN(monthsCount) || monthsCount <= 0) monthsCount = 6;
    if (monthsCount > 24) monthsCount = 24; // limit

    const data = await getMonthlySales(monthsCount);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching monthly sales:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTopProductsController = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit);
    if (isNaN(limit) || limit <= 0) limit = 5;
    const products = await getTopProducts(limit);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
