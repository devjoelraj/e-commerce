import Accessories from "../../../models/admin/addProduct/accessories.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../../utils/cloudinary.util.js";

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

  return accessoriesProduct;
};

// ---------- GET ALL PRODUCTS ----------
export const getAccessoriesProductsService = async (filters = {}) => {
  return await Accessories.find(filters)
    .populate("createdBy", "email")
    .sort({ createdAt: -1 });
};

// ---------- UPDATE PRODUCT ----------
export const updateAccessoriesProductService = async (id, updateData) => {
  const product = await Accessories.findById(id);
  if (!product) throw new Error("Accessories product not found");

  // Handle pricing if present
  if (updateData.pricing) {
    updateData.pricing = {
      basePrice: updateData.pricing.basePrice || product.pricing.basePrice,
      discountPercentage:
        updateData.pricing.discountPercentage ||
        product.pricing.discountPercentage,
      discountPrice:
        updateData.pricing.discountPrice || product.pricing.discountPrice,
    };
  }

  const updatedProduct = await Accessories.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate("createdBy", "email");

  return updatedProduct;
};

// ---------- DELETE PRODUCT ----------
export const deleteAccessoriesProductService = async (id) => {
  const product = await Accessories.findById(id);
  if (!product) throw new Error("Accessories product not found");

  const deletePromises = [];
  product.colors.forEach((color) => {
    color.images.forEach((image) => {
      deletePromises.push(deleteFromCloudinary(image.publicId));
    });
  });

  await Promise.all(deletePromises);
  await Accessories.findByIdAndDelete(id);

  return true;
};

// ---------- DELETE SINGLE IMAGE FROM COLOR VARIANT ----------
export const deleteProductImageService = async (
  productId,
  colorName,
  imageIndex,
) => {
  const product = await Accessories.findById(productId);
  if (!product) throw new Error("Accessories product not found");

  const colorIndex = product.colors.findIndex((c) => c.name === colorName);
  if (colorIndex === -1) throw new Error("Color not found");

  const image = product.colors[colorIndex].images[imageIndex];
  if (!image) throw new Error("Image not found");

  await deleteFromCloudinary(image.publicId);

  product.colors[colorIndex].images.splice(imageIndex, 1);
  await product.save();

  return product;
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
