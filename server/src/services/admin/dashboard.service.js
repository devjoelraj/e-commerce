import Order from "../../models/order.model.js";
import OfflineSale from "../../models/offlineSale.model.js";

export const getMonthlySalesInRange = async (startDate, endDate) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  // 1. Aggregation for online sales (orders)
  const onlineAgg = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        orderStatus: "delivered",
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        total: { $sum: "$totalAmount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  // 2. Aggregation for offline sales
  const offlineAgg = await OfflineSale.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        total: { $sum: "$price" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  const monthlyMap = new Map();

  onlineAgg.forEach((item) => {
    const key = `${item._id.year}-${item._id.month}`;
    monthlyMap.set(key, {
      monthLabel: getMonthLabel(item._id.year, item._id.month),
      online: item.total,
      offline: 0,
    });
  });

  offlineAgg.forEach((item) => {
    const key = `${item._id.year}-${item._id.month}`;
    if (monthlyMap.has(key)) {
      monthlyMap.get(key).offline = item.total;
    } else {
      monthlyMap.set(key, {
        monthLabel: getMonthLabel(item._id.year, item._id.month),
        online: 0,
        offline: item.total,
      });
    }
  });

  const result = Array.from(monthlyMap.values()).sort((a, b) => {
    const dateA = new Date(a.monthLabel + " 1");
    const dateB = new Date(b.monthLabel + " 1");
    return dateA - dateB;
  });

  return result;
};

function getMonthLabel(year, month) {
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export const getMonthlySales = async (monthsCount = 6) => {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setMonth(endDate.getMonth() - monthsCount + 1);
  startDate.setDate(1); // first day of that month
  return getMonthlySalesInRange(startDate, endDate);
};

export const getTopProducts = async (limit = 5) => {
  const onlineAgg = await Order.aggregate([
    { $match: { orderStatus: "delivered" } },
    { $unwind: "$items" },
    {
      $group: {
        _id: {
          productId: "$items.productId",
          productName: "$items.productName",
        },
        totalQuantity: { $sum: "$items.quantity" },
        totalRevenue: {
          $sum: { $multiply: ["$items.quantity", "$items.priceAtPurchase"] },
        },
      },
    },
    {
      $project: {
        productId: "$_id.productId",
        productName: "$_id.productName",
        totalQuantity: 1,
        totalRevenue: 1,
      },
    },
  ]);

  // Aggregate offline sales
  const offlineAgg = await OfflineSale.aggregate([
    {
      $group: {
        _id: {
          productId: "$productId",
          productName: "$productName",
        },
        totalQuantity: { $sum: "$quantity" },
        totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } },
      },
    },
    {
      $project: {
        productId: "$_id.productId",
        productName: "$_id.productName",
        totalQuantity: 1,
        totalRevenue: 1,
      },
    },
  ]);

  // Combine both results
  const productMap = new Map();
  const all = [...onlineAgg, ...offlineAgg];
  for (const item of all) {
    const key = item.productId.toString();
    if (productMap.has(key)) {
      const existing = productMap.get(key);
      existing.totalQuantity += item.totalQuantity;
      existing.totalRevenue += item.totalRevenue;
    } else {
      productMap.set(key, {
        productId: item.productId,
        productName: item.productName,
        totalQuantity: item.totalQuantity,
        totalRevenue: item.totalRevenue,
      });
    }
  }

  // Convert to array, compute average price, and sort by totalQuantity
  const products = Array.from(productMap.values()).map((p) => ({
    ...p,
    averagePrice: p.totalQuantity > 0 ? p.totalRevenue / p.totalQuantity : 0,
  }));
  products.sort((a, b) => b.totalQuantity - a.totalQuantity);

  return products.slice(0, limit);
};
