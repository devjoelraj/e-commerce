import express from "express";
import upload from "../middlewares/multer.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.js";

// Slider controllers
import {
  createSlider,
  deleteSlider,
  getSliders,
} from "../controllers/admin/addProduct/sliders.controller.js";

// Pants controllers
import {
  createPantsProduct,
  getPantsProducts,
  addColorVariantController as addPantsColorVariant,
} from "../controllers/admin/addProduct/pants.controller.js";

// Shirts controllers
import {
  createShirtsProduct,
  getShirtsProducts,
  addColorVariantController as addShirtsColorVariant,
  getShirtsProductById,
} from "../controllers/admin/addProduct/shirts.controller.js";
import {
  createShoesProduct,
  getShoesProducts,
  addColorVariantController as addShoesColorVariant,
  getFootwearProductById,
} from "../controllers/admin/addProduct/footWear.controller.js";
import {
  createAccessoriesProduct,
  getAccessoriesProductById,
  getAccessoriesProducts,
  addColorVariantController as addAccessoriesColorVariant,
} from "../controllers/admin/addProduct/accessories.controller.js";
import {
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/admin/getAllProduct.controller.js";
import {
  getAllOrders,
  updateOrderStatus,
} from "../controllers/admin/order.controller.js";
import { reduceStock } from "../controllers/stock.controller.js";
import {
  getMonthlySalesData,
  getTopProductsController,
} from "../controllers/admin/dashboard.controller.js";

const router = express.Router();

// ========== Public Routes ==========
// These are accessible without authentication
router.get("/pants", getPantsProducts);
router.get("/shirts", getShirtsProducts);
router.get("/shoes", getShoesProducts);
router.get("/accessories", getAccessoriesProducts);
router.get("/allProducts", getAllProducts);
router.get("/sliderUpload", getSliders);

//====
router.get("/shirts/:id", getShirtsProductById);
router.get("/footwear/:id", getFootwearProductById);
router.get("/accessories/:id", getAccessoriesProductById);

// ========== Admin‑Only Routes  ==========
router.use(protect);
router.use(authorize("admin", "superadmin"));
// Slider Admin
router.post("/sliderUpload", upload.array("file"), createSlider);
router.delete("/sliderUpload/:id", deleteSlider);

// Pants Admin
router.post(
  "/pantsUpload",
  upload.fields([{ name: "file", maxCount: 50 }]),
  createPantsProduct,
);
router.post(
  "/pants/colorVariant/:id",
  upload.array("file"),
  addPantsColorVariant,
);

// Shirts Admin
router.post(
  "/shirtsUpload",
  upload.fields([{ name: "file", maxCount: 50 }]),
  createShirtsProduct,
);
router.post(
  "/shirts/colorVariant/:id",
  upload.array("file"),
  addShirtsColorVariant,
);

// Footwear Admin
router.post(
  "/shoesUpload",
  upload.fields([{ name: "file", maxCount: 50 }]),
  createShoesProduct,
);
router.post(
  "/shoes/colorVariant/:id",
  upload.array("file"),
  addShoesColorVariant,
);

// Accessories Admin
router.post(
  "/accessoriesUpload",
  upload.fields([{ name: "file", maxCount: 50 }]),
  createAccessoriesProduct,
);
router.post(
  "/accessories/colorVariant/:id",
  upload.array("file"),
  addAccessoriesColorVariant,
);

// Product Management
router.post("/deleteProduct", deleteProduct);
router.post("/updateProduct", updateProduct);

// Orders Management
router.get("/orders", getAllOrders);
router.put("/orders/:orderId/status", updateOrderStatus);

// Stock Reduction
router.post("/stock/reduce", reduceStock);

//dashboard
router.get("/sales-monthly", getMonthlySalesData);
router.get("/top-products", getTopProductsController);

export default router;
