import offlineSaleModel from "../../models/offlineSale.model.js";
import { getProductModel } from "../../utils/productHelpers.js";

export const reduceStockService = async ({
  productId,
  category,
  color,
  size,
  quantity,
  adminId,
  sellingPrice,
}) => {
  const Model = getProductModel(category);
  const product = await Model.findById(productId);
  if (!product) throw new Error("Product not found");

  const colorObj = product.colors.find((c) => c.name === color);
  if (!colorObj) throw new Error("Color not found");

  if (category === "Accessories") {
    if (colorObj.qty < quantity) throw new Error("Insufficient stock");
    colorObj.qty -= quantity;
    product.totalQuantity -= quantity;
  } else {
    if (!size) throw new Error("Size required");
    const sizeObj = colorObj.sizes.find((s) => s.size === size);
    if (!sizeObj || sizeObj.qty < quantity)
      throw new Error("Insufficient stock");
    sizeObj.qty -= quantity;
    product.totalQuantity -= quantity;
  }

  await product.save();

  const finalPrice =
    sellingPrice !== undefined && sellingPrice !== null && sellingPrice > 0
      ? sellingPrice
      : product.pricing?.discountPrice || product.pricing?.basePrice;

  await offlineSaleModel.create({
    productId,
    category,
    productName: product.productName,
    color,
    size: category === "Accessories" ? null : size,
    quantity,
    price: finalPrice,
    createdBy: adminId,
  });

  return product;
};
