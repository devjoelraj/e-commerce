import Cart from "../models/cart.model.js";
import Pants from "../models/admin/addProduct/pants.model.js";
import Footwear from "../models/admin/addProduct/footwear.model.js";
import Accessories from "../models/admin/addProduct/accessories.model.js";
import Shirts from "../models/admin/addProduct/shirts.model.js";

const EXPIRY_TIME = 30 * 60 * 1000; // 30 mins

const getModel = (category) => {
  switch (category) {
    case "Pants":
      return Pants;
    case "Footwear":
      return Footwear;
    case "Accessories":
      return Accessories;
    case "Shirts":
      return Shirts;
  }
};

export const clearExpiredCartItems = async () => {
  const carts = await Cart.find();

  for (const cart of carts) {
    const validItems = [];

    for (const item of cart.items) {
      const isExpired = new Date() - new Date(item.addedAt) > EXPIRY_TIME;

      if (isExpired) {
        const Model = getModel(item.category);

        if (item.category === "Accessories") {
          await Model.updateOne(
            {
              _id: item.productId,
              "colors.name": item.color,
            },
            {
              $inc: { "colors.$.qty": item.quantity },
            },
          );
        } else {
          await Model.updateOne(
            {
              _id: item.productId,
              "colors.name": item.color,
              "colors.sizes.size": item.size,
            },
            {
              $inc: {
                "colors.$[color].sizes.$[size].qty": item.quantity,
              },
            },
            {
              arrayFilters: [
                { "color.name": item.color },
                { "size.size": item.size },
              ],
            },
          );
        }
      } else {
        validItems.push(item);
      }
    }

    cart.items = validItems;
    await cart.save();
  }
};
