import mongoose from "mongoose";
import Order from "../../models/order.model.js";
import Cart from "../../models/cart.model.js";
import Address from "../../models/address.model.js";
import { getProductModel } from "../../utils/productHelpers.js";

export const placeOrderService = async ({
  userId,
  addressData,
  saveAddress = false,
  idempotencyKey,
}) => {
  // 1. Idempotency check
  if (idempotencyKey) {
    const existingOrder = await Order.findOne({ idempotencyKey });
    if (existingOrder) return existingOrder;
  }

  // 2. Validate address data
  if (!addressData) throw new Error("Address is required");

  // 3. Optionally save address for future (upsert)
  if (saveAddress) {
    await Address.findOneAndUpdate(
      { userId },
      { $set: addressData },
      { upsert: true, new: true },
    );
  }

  // 4. Get cart
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  // 5. Process each item: validate stock and decrement atomically
  const orderItems = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    const Model = getProductModel(item.category);
    const product = await Model.findById(item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);

    const colorObj = product.colors.find((c) => c.name === item.color);
    if (!colorObj) throw new Error(`Color ${item.color} not available`);
    const imageUrl = colorObj.images?.[0]?.imageUrl || "";

    let updateResult;
    if (item.category !== "Accessories") {
      if (!item.size) throw new Error("Size missing");
      updateResult = await Model.updateOne(
        {
          _id: item.productId,
          "colors.name": item.color,
          "colors.sizes.size": item.size,
          "colors.sizes.qty": { $gte: item.quantity },
        },
        {
          $inc: { "colors.$[color].sizes.$[size].qty": -item.quantity },
        },
        {
          arrayFilters: [
            { "color.name": item.color },
            { "size.size": item.size },
          ],
        },
      );
    } else {
      updateResult = await Model.updateOne(
        {
          _id: item.productId,
          "colors.name": item.color,
          "colors.qty": { $gte: item.quantity },
        },
        {
          $inc: { "colors.$.qty": -item.quantity },
        },
      );
    }

    if (updateResult.modifiedCount === 0) {
      throw new Error(`Insufficient stock for ${product.productName}`);
    }

    const price = item.priceAtAdded;
    totalAmount += price * item.quantity;
    orderItems.push({
      productId: item.productId,
      category: item.category,
      productName: product.productName,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      priceAtPurchase: price,
      image: imageUrl,
    });
  }

  const order = new Order({
    userId,
    items: orderItems,
    totalAmount,
    shippingAddress: addressData,
    paymentStatus: "pending",
    orderStatus: "pending",
    idempotencyKey,
  });

  await order.save();

  await Cart.deleteOne({ userId });

  return order;
};

export const getUserOrdersService = async (userId) => {
  return await Order.find({ userId }).sort({ createdAt: -1 });
};
