import Accessories from "../../../models/admin/addProduct/accessories.model.js";
import { addToSearchDB } from "../../../utils/addToSearchDB.js";
import { uploadToCloudinary } from "../../../utils/cloudinary.util.js";

// ---------- CREATE PRODUCT ----------
export const createAccessoriesProductService = async ({
  productName,
  description,
  type,
  basePrice,
  discountPercentage,
  discountPrice,
  colors,
  colorImages,
  userId,
}) => {
  if (!productName || !description || !basePrice || !discountPrice || !colors) {
    throw new Error("Required fields missing");
  }

  const imagePromises = [];
  const colorImageMap = {};

  colors.forEach((color) => {
    colorImageMap[color.name] = [];

    if (colorImages[color.name]) {
      colorImages[color.name].forEach((file) => {
        imagePromises.push(
          uploadToCloudinary(file.buffer).then((result) => ({
            ...result,
            colorName: color.name,
          })),
        );
      });
    }
  });

  const uploadedImages = await Promise.all(imagePromises);

  uploadedImages.forEach((img) => {
    colorImageMap[img.colorName].push({
      imageUrl: img.imageUrl,
      publicId: img.publicId,
    });
  });

  const colorsWithImages = colors.map((color) => ({
    name: color.name,
    hex: color.hex,
    qty: Number(color.qty) || 0,
    images: colorImageMap[color.name] || [],
  }));

  const accessoriesProduct = await Accessories.create({
    productName,
    description,
    type,
    pricing: {
      basePrice: Number(basePrice),
      discountPercentage: Number(discountPercentage),
      discountPrice: Number(discountPrice),
    },
    colors: colorsWithImages,
    createdBy: userId,
  });
  await addToSearchDB(accessoriesProduct, "Accessories");

  return accessoriesProduct;
};

// ---------- GET ALL PRODUCTS ----------
export const getAccessoriesProductsService = async (
  filters = {},
  page = 1,
  limit = 15,
) => {
  const skip = (page - 1) * limit;

  const products = await Accessories.find(filters)
    .populate("createdBy", "email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Accessories.countDocuments(filters);

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

// ---------- ADD NEW COLOR VARIANT ----------
export const addColorVariantService = async (
  productId,
  colorsString,
  files,
) => {
  const colors = JSON.parse(colorsString);

  const product = await Accessories.findById(productId);
  if (!product) throw new Error("Product not found");

  const colorImageMap = {};
  const imagePromises = [];

  colors.forEach((color) => {
    const existingColor = product.colors.find(
      (c) => c.name.toLowerCase() === color.name.toLowerCase(),
    );

    if (existingColor) {
      throw new Error(`${color.name} color already exists`);
    }

    colorImageMap[color.name] = [];

    files.forEach((file) => {
      imagePromises.push(
        uploadToCloudinary(file.buffer).then((result) => ({
          ...result,
          colorName: color.name,
        })),
      );
    });
  });

  const uploadedImages = await Promise.all(imagePromises);

  uploadedImages.forEach((img) => {
    colorImageMap[img.colorName].push({
      imageUrl: img.imageUrl,
      publicId: img.publicId,
    });
  });

  colors.forEach((color) => {
    product.colors.push({
      name: color.name,
      hex: color.hex,
      qty: Number(color.qty) || 0,
      images: colorImageMap[color.name] || [],
    });
  });

  await product.save();
  return product;
};
export const getAccessoriesProductByIdService = async (id) => {
  return await Accessories.findById(id).populate("createdBy", "email");
};
