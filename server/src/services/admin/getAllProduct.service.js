import Shirts from "../../models/admin/addProduct/shirts.model.js";
import Pants from "../../models/admin/addProduct/pants.model.js";
import Accessories from "../../models/admin/addProduct/accessories.model.js";
import footWearModel from "../../models/admin/addProduct/footWear.model.js";
import { deleteFromCloudinary } from "../../utils/cloudinary.util.js";

export const getAllProductsService = async () => {
  const [shirts, pants, footwear, accessories] = await Promise.all([
    Shirts.find({ isActive: true }).sort({ createdAt: -1 }),
    Pants.find({ isActive: true }).sort({ createdAt: -1 }),
    footWearModel.find({ isActive: true }).sort({ createdAt: -1 }),
    Accessories.find({ isActive: true }).sort({ createdAt: -1 }),
  ]);

  const formattedProducts = [
    ...shirts.map((item) => ({
      ...item.toObject(),
      category: "shirts",
    })),

    ...pants.map((item) => ({
      ...item.toObject(),
      category: "pants",
    })),

    ...footwear.map((item) => ({
      ...item.toObject(),
      category: "footwear",
    })),

    ...accessories.map((item) => ({
      ...item.toObject(),
      category: "accessories",
    })),
  ];

  return formattedProducts;
};

export const deleteProductService = async (category, id) => {
  const modelMap = {
    shirts: Shirts,
    pants: Pants,
    footwear: footWearModel,
    accessories: Accessories,
  };

  const Model = modelMap[category];

  if (!Model) throw new Error("Invalid category");

  const product = await Model.findById(id);

  if (!product) throw new Error("Product not found");

  const deletePromises = [];

  product.colors.forEach((color) => {
    color.images.forEach((image) => {
      deletePromises.push(deleteFromCloudinary(image.publicId));
    });
  });

  await Promise.all(deletePromises);

  await Model.findByIdAndDelete(id);

  return true;
};
export const deleteProductImageService = async (
  category,
  productId,
  colorName,
  imageIndex,
) => {
  const modelMap = {
    shirts: Shirts,
    pants: Pants,
    footwear: footWearModel,
    accessories: Accessories,
  };

  const Model = modelMap[category];

  if (!Model) throw new Error("Invalid category");

  const product = await Model.findById(productId);

  if (!product) throw new Error("Product not found");

  const colorIndex = product.colors.findIndex((c) => c.name === colorName);

  if (colorIndex === -1) throw new Error("Color not found");

  const image = product.colors[colorIndex].images[imageIndex];

  if (!image) throw new Error("Image not found");

  await deleteFromCloudinary(image.publicId);

  product.colors[colorIndex].images.splice(imageIndex, 1);

  await product.save();

  return product;
};

export const updateProductService = async (body) => {
  const { _id, category, pricing, colors } = body;

  const modelMap = {
    shirts: Shirts,
    pants: Pants,
    footwear: footWearModel,
    accessories: Accessories,
  };

  const Model = modelMap[category];

  if (!Model) throw new Error("Invalid category");

  const product = await Model.findById(_id);

  if (!product) throw new Error("Product not found");

  product.pricing = pricing;
  product.colors = colors;

  if (category === "accessories") {
    product.totalQuantity = colors.reduce((sum, c) => sum + (c.qty || 0), 0);
  } else {
    product.totalQuantity = colors.reduce(
      (sum, c) => sum + c.sizes.reduce((s, size) => s + (size.qty || 0), 0),
      0,
    );
  }

  await product.save();

  return product;
};
