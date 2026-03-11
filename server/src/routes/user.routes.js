import express from "express";
import {
  getOfferProducts,
  getProductById,
} from "../controllers/user/getProduct.controller.js";

const router = express.Router();

router.get("/product/:id", getProductById);
router.get("/offers", getOfferProducts);

export default router;
