import pantsModel from "../../models/admin/addProduct/pants.model.js";
import Shirts from "../../models/admin/addProduct/shirts.model.js";
import Pants from "../../models/admin/addProduct/pants.model.js";
import footWear from "../../models/admin/addProduct/footWear.model.js";
import Accessories from "../../models/admin/addProduct/accessories.model.js";

export const getPantsProductByIdService = async (id) => {
  const product = await pantsModel.findById(id).populate("createdBy", "email");
  if (!product) throw new Error("Pants product not found");
  return product;
};

export const getOfferProductsService = async () => {
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

  const formattedProducts = [
    ...shirts.map((item) => ({ ...item.toObject(), category: "shirts" })),
    ...pants.map((item) => ({ ...item.toObject(), category: "pants" })),
    ...footwear.map((item) => ({ ...item.toObject(), category: "footwear" })),
    ...accessories.map((item) => ({
      ...item.toObject(),
      category: "accessories",
    })),
  ];

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
