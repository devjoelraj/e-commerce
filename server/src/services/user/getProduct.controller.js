import pantsModel from "../../models/admin/addProduct/pants.model.js";
import Shirts from "../../models/admin/addProduct/shirts.model.js";
import Pants from "../../models/admin/addProduct/pants.model.js";
import footWear from "../../models/admin/addProduct/footWear.model.js";
import Accessories from "../../models/admin/addProduct/accessories.model.js";
import Order from "../../models/order.model.js";
import OfflineSale from "../../models/offlineSale.model.js";
import { getProductModel } from "../../utils/productHelpers.js";

export const getPantsProductByIdService = async (id) => {
  const product = await pantsModel.findById(id).populate("createdBy", "email");
  if (!product) throw new Error("Pants product not found");
  return product;
};

export const getOfferProductsService = async (limit = null) => {
  const [shirts, pants, footwear, accessories] = await Promise.all([
    Shirts.find({ isActive: true, offerProduct: true }).sort({ createdAt: -1 }),
    Pants.find({ isActive: true, offerProduct: true }).sort({ createdAt: -1 }),
    footWear
      .find({ isActive: true, offerProduct: true })
      .sort({ createdAt: -1 }),
    Accessories.find({ isActive: true, offerProduct: true }).sort({
      createdAt: -1,
    }),
  ]);

  let formattedProducts = [
    ...shirts.map((item) => ({ ...item.toObject(), category: "shirts" })),
    ...pants.map((item) => ({ ...item.toObject(), category: "pants" })),
    ...footwear.map((item) => ({ ...item.toObject(), category: "footwear" })),
    ...accessories.map((item) => ({
      ...item.toObject(),
      category: "accessories",
    })),
  ];

  formattedProducts.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  if (limit) {
    formattedProducts = formattedProducts.slice(0, limit);
  }

  return formattedProducts;
};

export const getAllProductsUserService = async (page = 1, limit = 15) => {
  const [shirts, pants, footwear, accessories] = await Promise.all([
    Shirts.find({ isActive: true }).sort({ createdAt: -1 }),
    Pants.find({ isActive: true }).sort({ createdAt: -1 }),
    footWear.find({ isActive: true }).sort({ createdAt: -1 }),
    Accessories.find({ isActive: true }).sort({ createdAt: -1 }),
  ]);

  const formattedProducts = [
    ...shirts.map((item) => ({ ...item.toObject(), category: "shirts" })),
    ...pants.map((item) => ({ ...item.toObject(), category: "pants" })),
    ...footwear.map((item) => ({ ...item.toObject(), category: "footwear" })),
    ...accessories.map((item) => ({
      ...item.toObject(),
      category: "accessories",
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // sort by newest

  const total = formattedProducts.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedProducts = formattedProducts.slice(start, end);

  return {
    products: paginatedProducts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getTopProductsFull = async (limit = 5) => {
  // 1. Aggregate online orders (delivered)
  const onlineAgg = await Order.aggregate([
    { $match: { orderStatus: "delivered" } },
    { $unwind: "$items" },
    {
      $group: {
        _id: {
          productId: "$items.productId",
          productName: "$items.productName",
          category: "$items.category",
        },
        totalQuantity: { $sum: "$items.quantity" },
      },
    },
    {
      $project: {
        _id: 0,
        productId: "$_id.productId",
        productName: "$_id.productName",
        category: "$_id.category",
        totalQuantity: 1,
      },
    },
  ]);

  // 2. Aggregate offline sales
  const offlineAgg = await OfflineSale.aggregate([
    {
      $group: {
        _id: {
          productId: "$productId",
          productName: "$productName",
          category: "$category",
        },
        totalQuantity: { $sum: "$quantity" },
      },
    },
    {
      $project: {
        _id: 0,
        productId: "$_id.productId",
        productName: "$_id.productName",
        category: "$_id.category",
        totalQuantity: 1,
      },
    },
  ]);

  // 3. Combine and aggregate total quantity per product
  const productMap = new Map();
  const addToMap = (items) => {
    for (const item of items) {
      const key = item.productId.toString();
      if (productMap.has(key)) {
        const existing = productMap.get(key);
        existing.totalQuantity += item.totalQuantity;
      } else {
        productMap.set(key, {
          productId: item.productId,
          productName: item.productName,
          category: item.category,
          totalQuantity: item.totalQuantity,
        });
      }
    }
  };
  addToMap(onlineAgg);
  addToMap(offlineAgg);

  // 4. Sort by totalQuantity and take top N
  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, limit);

  // 5. Fetch full product details from the appropriate model
  const detailedProducts = [];
  for (const prod of topProducts) {
    try {
      const Model = getProductModel(prod.category);
      const product = await Model.findById(prod.productId).lean();
      if (product) {
        detailedProducts.push({
          ...product,
          category: prod.category, // e.g., "Shirts", "Pants", "Footwear", "Accessories"
        });
      } else {
        console.warn(
          `Product ${prod.productId} (${prod.category}) not found, skipping.`,
        );
      }
    } catch (err) {
      console.error(`Error fetching product ${prod.productId}:`, err);
    }
  }

  return detailedProducts;
};
