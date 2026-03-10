import footWear from "../../../models/admin/addProduct/footWear.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../../utils/cloudinary.util.js";

export const createShoesProductService = async ({
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

  let totalQuantity = 0;

  const colorsWithImages = colors.map((color) => {
    const sizesArray = Object.entries(color.sizes)
      .filter(([_, qty]) => Number(qty) > 0)
      .map(([size, qty]) => ({
        size: String(size),
        qty: Number(qty),
      }));
    const colorQty = sizesArray.reduce((sum, s) => sum + s.qty, 0);

    totalQuantity += colorQty;

    return {
      name: color.name,
      hex: color.hex,
      sizes: sizesArray,
      images: colorImageMap[color.name] || [],
    };
  });

  const shoesProduct = await footWear.create({
    productName,
    description,
    type,
    pricing: {
      basePrice: Number(basePrice),
      discountPercentage: Number(discountPercentage),
      discountPrice: Number(discountPrice),
    },
    colors: colorsWithImages,
    totalQuantity,
    createdBy: userId,
  });

  return shoesProduct;
};

export const getShoesProductsService = async (filters = {}) => {
  return await footWear
    .find(filters)
    .populate("createdBy", "email")
    .sort({ createdAt: -1 });
};
export const getFootwearProductByIdService = async (id) => {
  return await footWear.findById(id).populate("createdBy", "email");
};

export const updateShoesProductService = async (id, updateData) => {
  const product = await footWear.findById(id);
  if (!product) throw new Error("Shoes product not found");

  if (updateData.sizes && typeof updateData.sizes === "string") {
    try {
      updateData.sizes = JSON.parse(updateData.sizes);
    } catch (e) {
      throw new Error("Invalid sizes data");
    }
  }

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

  if (updateData.sizes) {
    const totalQuantity = Object.values(updateData.sizes).reduce(
      (sum, qty) => sum + qty,
      0,
    );
    updateData.totalQuantity = totalQuantity;
    updateData.sizes = new Map(Object.entries(updateData.sizes));
  }

  if (
    updateData.totalQuantity !== undefined &&
    updateData.sizes === undefined
  ) {
    updateData.totalQuantity = Number(updateData.totalQuantity);
  }

  const updatedProduct = await footWear
    .findByIdAndUpdate(id, updateData, {
      new: true,
    })
    .populate("createdBy", "email");

  return updatedProduct;
};

export const deleteShoesProductService = async (id) => {
  const product = await footWear.findById(id);
  if (!product) throw new Error("Shoes product not found");

  const deletePromises = [];
  product.colors.forEach((color) => {
    color.images.forEach((image) => {
      deletePromises.push(deleteFromCloudinary(image.publicId));
    });
  });

  await Promise.all(deletePromises);
  await footWear.findByIdAndDelete(id);

  return true;
};

export const deleteProductImageService = async (
  productId,
  colorName,
  imageIndex,
) => {
  const product = await footWear.findById(productId);
  if (!product) throw new Error("Shoes product not found");

  const colorIndex = product.colors.findIndex((c) => c.name === colorName);
  if (colorIndex === -1) throw new Error("Color not found");

  const image = product.colors[colorIndex].images[imageIndex];
  if (!image) throw new Error("Image not found");

  await deleteFromCloudinary(image.publicId);

  product.colors[colorIndex].images.splice(imageIndex, 1);
  await product.save();

  return product;
};

export const addColorVariantService = async (
  productId,
  colorsString,
  files,
) => {
  const colors = JSON.parse(colorsString);

  const product = await footWear.findById(productId);
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
    const sizesArray = Object.entries(color.sizes)
      .filter(([_, qty]) => Number(qty) > 0)
      .map(([size, qty]) => ({
        size: String(size),
        qty: Number(qty),
      }));
    const colorQty = sizesArray.reduce((sum, s) => sum + s.qty, 0);

    product.totalQuantity += colorQty;

    product.colors.push({
      name: color.name,
      hex: color.hex,
      sizes: sizesArray,
      images: colorImageMap[color.name] || [],
    });
  });

  await product.save();
  return product;
};
