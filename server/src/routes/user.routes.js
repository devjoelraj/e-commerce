import express from "express";
import {
  getAllProductsUser,
  getOfferProducts,
  getProductById,
} from "../controllers/user/getProduct.controller.js";
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from "../controllers/user/watchlist.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../controllers/user/cart.controller.js";

const router = express.Router();

router.get("/product/:id", getProductById);
router.get("/offers", getOfferProducts);
router.get("/Allproducts", getAllProductsUser);

router.post("/watchlist/add", protect, addToWatchlist);
router.post("/watchlist/remove", protect, removeFromWatchlist);
router.get("/watchlist", protect, getWatchlist);

router.post("/addtocart", protect, addToCart);
router.delete("/cart/remove", protect, removeFromCart);
router.put("/cart/update", protect, updateCartQuantity);
router.get("/cart", protect, getCart);
// router.delete("/cart/clear", protect, clearCart);

export default router;
