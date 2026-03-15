import express from "express";
import {
  getAllProductsUser,
  getOfferProducts,
  getProductById,
} from "../controllers/user/getProduct.controller.js";

const router = express.Router();

router.get("/product/:id", getProductById);
router.get("/offers", getOfferProducts);
router.get("/Allproducts", getAllProductsUser);

export default router;
