import {
  addToWatchlistService,
  getWatchlistService,
  removeFromWatchlistService,
} from "../../services/user/watchlist.service.js";

export const addToWatchlist = async (req, res) => {
  try {
    console.log("addToWatchlist body:", req.body);

    const userId = req.user.userId;
    const { productId, category } = req.body;
    console.log("productId:", productId, "category:", category);

    const result = await addToWatchlistService({ userId, productId, category });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, category } = req.body;

    const result = await removeFromWatchlistService({
      userId,
      productId,
      category,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getWatchlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await getWatchlistService(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
