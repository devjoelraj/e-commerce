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

  /* 🔐 ATOMIC STOCK LOCK */
  let updateQuery;
  let updateOperation;
  let options;

  if (category === "Accessories") {
    updateQuery = {
      _id: productId,
      "colors.name": color,
      "colors.qty": { $gte: quantity },
    };

    updateOperation = {
      $inc: { "colors.$.qty": -quantity },
    };

    options = { new: true };
  } else {
    if (!size) throw new Error("Size required");

    updateQuery = {
      _id: productId,
      "colors.name": color,
      "colors.sizes.size": size,
      "colors.sizes.qty": { $gte: quantity },
    };

    updateOperation = {
      $inc: {
        "colors.$[color].sizes.$[size].qty": -quantity,
      },
    };

    options = {
      new: true,
      arrayFilters: [{ "color.name": color }, { "size.size": size }],
    };
  }

  const updatedProduct = await Model.findOneAndUpdate(
    updateQuery,
    updateOperation,
    options,
  );

  if (!updatedProduct) {
    throw new Error("Out of stock");
  }

  /* 🛒 CART LOGIC */
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
  const price =
    updatedProduct.pricing?.discountPrice || updatedProduct.pricing?.basePrice;
  if (!price) throw new Error("Product price not found");
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.addedAt = new Date(); // 🔄 refresh expiry
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

  const item = cart.items[itemIndex];

  const Model = getProductModel(category);

  /* 🔄 RESTORE STOCK */
  if (category === "Accessories") {
    await Model.updateOne(
      {
        _id: productId,
        "colors.name": color,
      },
      {
        $inc: { "colors.$.qty": item.quantity },
      },
    );
  } else {
    await Model.updateOne(
      {
        _id: productId,
        "colors.name": color,
        "colors.sizes.size": size,
      },
      {
        $inc: {
          "colors.$[color].sizes.$[size].qty": item.quantity,
        },
      },
      {
        arrayFilters: [{ "color.name": color }, { "size.size": size }],
      },
    );
  }

  /* 🗑 Remove item */
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
  if (newQuantity <= 0) {
    throw new Error("Quantity must be at least 1");
  }

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

  const oldQuantity = item.quantity;
  const diff = newQuantity - oldQuantity;

  const Model = getProductModel(category);

  /* 🔼 INCREASE QTY */
  if (diff > 0) {
    let updateQuery;
    let updateOperation;
    let options;

    if (category === "Accessories") {
      updateQuery = {
        _id: productId,
        "colors.name": color,
        "colors.qty": { $gte: diff },
      };

      updateOperation = {
        $inc: { "colors.$.qty": -diff },
      };

      options = { new: true };
    } else {
      updateQuery = {
        _id: productId,
        "colors.name": color,
        "colors.sizes.size": size,
        "colors.sizes.qty": { $gte: diff },
      };

      updateOperation = {
        $inc: {
          "colors.$[color].sizes.$[size].qty": -diff,
        },
      };

      options = {
        arrayFilters: [{ "color.name": color }, { "size.size": size }],
      };
    }

    const updated = await Model.findOneAndUpdate(
      updateQuery,
      updateOperation,
      options,
    );

    if (!updated) {
      throw new Error("Not enough stock");
    }
  }

  /* 🔽 DECREASE QTY */
  if (diff < 0) {
    const restoreQty = Math.abs(diff);

    if (category === "Accessories") {
      await Model.updateOne(
        {
          _id: productId,
          "colors.name": color,
        },
        {
          $inc: { "colors.$.qty": restoreQty },
        },
      );
    } else {
      await Model.updateOne(
        {
          _id: productId,
          "colors.name": color,
          "colors.sizes.size": size,
        },
        {
          $inc: {
            "colors.$[color].sizes.$[size].qty": restoreQty,
          },
        },
        {
          arrayFilters: [{ "color.name": color }, { "size.size": size }],
        },
      );
    }
  }

  /* 🛒 UPDATE CART */
  item.quantity = newQuantity;
  item.addedAt = new Date(); // refresh expiry

  await cart.save();

  return cart;
};

export const getCartService = async (userId) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return {
      items: [],
      totalItems: 0,
    };
  }

  return {
    items: cart.items,
    totalItems: cart.items.length,
  };
};
