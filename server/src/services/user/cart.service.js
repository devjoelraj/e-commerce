import Cart from "../../models/cart.model.js";
import Pants from "../../models/admin/addProduct/pants.model.js";
import Footwear from "../../models/admin/addProduct/footwear.model.js";
import Accessories from "../../models/admin/addProduct/accessories.model.js";
import Shirts from "../../models/admin/addProduct/shirts.model.js";

const getProductModel = (category) => {
  switch (category) {
    case "Pants":
      return Pants;
    case "Footwear":
      return Footwear;
    case "Accessories":
      return Accessories;
    case "Shirts":
      return Shirts;
    default:
      throw new Error("Invalid category");
  }
};

export const addToCartService = async ({
  userId,
  productId,
  category,
  color,
  size,
  quantity = 1,
}) => {
  if (!userId || !productId || !category || !color) {
    throw new Error("Missing required fields");
  }
  if (quantity <= 0) throw new Error("Invalid quantity");

  const Model = getProductModel(category);

  // Optional: Check if product exists and has enough stock (but do NOT decrement)
  const product = await Model.findById(productId);
  if (!product) throw new Error("Product not found");

  const colorObj = product.colors.find((c) => c.name === color);
  if (!colorObj) throw new Error("Color not found");

  if (category !== "Accessories") {
    if (!size) throw new Error("Size required");
    const sizeObj = colorObj.sizes.find((s) => s.size === size);
    if (!sizeObj || sizeObj.qty < quantity)
      throw new Error("Insufficient stock");
  } else {
    if (colorObj.qty < quantity) throw new Error("Insufficient stock");
  }

  const price = product.pricing?.discountPrice || product.pricing?.basePrice;
  if (!price) throw new Error("Product price not found");

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) =>
      item.productId.toString() === productId &&
      item.category === category &&
      item.color === color &&
      item.size === (category === "Accessories" ? null : size),
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.addedAt = new Date();
  } else {
    cart.items.push({
      productId,
      category,
      color,
      size: category === "Accessories" ? null : size,
      quantity,
      priceAtAdded: price,
      addedAt: new Date(),
    });
  }

  await cart.save();
  return cart;
};

export const removeFromCartService = async ({
  userId,
  productId,
  category,
  color,
  size,
}) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  const itemIndex = cart.items.findIndex(
    (item) =>
      item.productId.toString() === productId &&
      item.category === category &&
      item.color === color &&
      item.size === (category === "Accessories" ? null : size),
  );
  if (itemIndex === -1) throw new Error("Item not found in cart");

  // No stock restoration – just remove from cart
  cart.items.splice(itemIndex, 1);
  await cart.save();
  return cart;
};

export const updateCartQuantityService = async ({
  userId,
  productId,
  category,
  color,
  size,
  newQuantity,
}) => {
  if (newQuantity <= 0) throw new Error("Quantity must be at least 1");

  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.find(
    (item) =>
      item.productId.toString() === productId &&
      item.category === category &&
      item.color === color &&
      item.size === (category === "Accessories" ? null : size),
  );
  if (!item) throw new Error("Item not found");

  // Optional: Check if the new quantity is still within stock limits
  const Model = getProductModel(category);
  const product = await Model.findById(productId);
  if (!product) throw new Error("Product not found");

  const colorObj = product.colors.find((c) => c.name === color);
  if (!colorObj) throw new Error("Color not found");

  if (category !== "Accessories") {
    if (!size) throw new Error("Size required");
    const sizeObj = colorObj.sizes.find((s) => s.size === size);
    if (!sizeObj || sizeObj.qty < newQuantity)
      throw new Error("Insufficient stock");
  } else {
    if (colorObj.qty < newQuantity) throw new Error("Insufficient stock");
  }

  item.quantity = newQuantity;
  item.addedAt = new Date();
  await cart.save();
  return cart;
};

export const getCartService = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) return { items: [], totalItems: 0 };
  return { items: cart.items, totalItems: cart.items.length };
};
