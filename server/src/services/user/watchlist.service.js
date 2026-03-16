import User from "../../models/user.model.js";
import Pants from "../../models/admin/addProduct/pants.model.js";
import Shirts from "../../models/admin/addProduct/shirts.model.js";
import Footwear from "../../models/admin/addProduct/footWear.model.js";
import Accessories from "../../models/admin/addProduct/accessories.model.js";

const modelMap = {
  Pants,
  Shirts,
  Footwear,
  Accessories,
};

export const addToWatchlistService = async ({
  userId,
  productId,
  category,
}) => {
  if (!userId || !productId || !category) {
    throw new Error("Missing required fields");
  }

  const Model = modelMap[category];
  if (!Model) throw new Error("Invalid category");

  const product = await Model.findById(productId);
  if (!product) throw new Error("Product not found");

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const alreadyExists = user.watchlist.some(
    (item) =>
      item.productId.toString() === productId && item.category === category,
  );
  if (alreadyExists) throw new Error("Product already in watchlist");

  user.watchlist.push({ productId, category });
  await user.save();

  return { success: true, message: "Added to watchlist" };
};

export const removeFromWatchlistService = async ({
  userId,
  productId,
  category,
}) => {
  if (!userId || !productId || !category) {
    throw new Error("Missing required fields");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.watchlist = user.watchlist.filter(
    (item) =>
      !(item.productId.toString() === productId && item.category === category),
  );
  await user.save();

  return { success: true, message: "Removed from watchlist" };
};

export const getWatchlistService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const populatedItems = await Promise.all(
    user.watchlist.map(async (item) => {
      const Model = modelMap[item.category];
      if (!Model) return null;

      const product = await Model.findById(item.productId).lean();
      if (!product) return null;

      return {
        ...product,
        category: item.category,
        watchlistId: item._id,
        addedAt: item.addedAt,
      };
    }),
  );

  const validItems = populatedItems.filter((p) => p !== null);

  return {
    success: true,
    data: validItems,
  };
};
