import express from "express";
import { getProductById } from "../controllers/user/getProduct/getProduct.controller.js";

const router = express.Router();

router.get("/product/:id", getProductById);

export default router;