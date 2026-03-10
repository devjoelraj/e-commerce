import shirtsModel from "../../../models/admin/addProduct/shirts.model.js";

export const createShirtsProductService = async ({
  productName,
  description,
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

  const shirtsProduct = await shirtsModel.create({
    productName,
    description,
    pricing: {
      basePrice: Number(basePrice),
      discountPercentage: Number(discountPercentage),
      discountPrice: Number(discountPrice),
    },
    colors: colorsWithImages,
    totalQuantity,
    createdBy: userId,
  });

  return shirtsProduct;
};

export const getShirtsProductsService = async (filters = {}) => {
  return await shirtsModel
    .find(filters)
    .populate("createdBy", "email")
    .sort({ createdAt: -1 });
};

export const getShirtsProductByIdService = async (id) => {
  return await Shirts.findById(id).populate("createdBy", "email");
};
export const updateShirtsProductService = async (id, updateData) => {
  const product = await shirtsModel.findById(id);
  if (!product) throw new Error("Shirts product not found");

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

  const updatedProduct = await shirtsModel
    .findByIdAndUpdate(id, updateData, {
      new: true,
    })
    .populate("createdBy", "email");

  return updatedProduct;
};

// Add a new color variant to an existing shirts product
export const addColorVariantService = async (
  productId,
  colorsString,
  files,
) => {
  const colors = JSON.parse(colorsString);

  const product = await shirtsModel.findById(productId);
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
