import express from "express";
import upload from "../middlewares/multer.js";

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
  updatePantsProduct,
  addColorVariantController as addPantsColorVariant,
  deleteProduct as deletePantsProduct,
} from "../controllers/admin/addProduct/pants.controller.js";

// Shirts controllers
import {
  createShirtsProduct,
  getShirtsProducts,
  updateShirtsProduct,
  addColorVariantController as addShirtsColorVariant,
  deleteProduct as deleteShirtsProduct,
  getShirtsProductById,
} from "../controllers/admin/addProduct/shirts.controller.js";

//footwear controllers
import {
  createShoesProduct,
  getShoesProducts,
  updateShoesProduct,
  addColorVariantController as addShoesColorVariant,
  deleteProduct as deleteShoesProduct,
  getFootwearProductById,
} from "../controllers/admin/addProduct/footWear.controller.js";
import {
  createAccessoriesProduct,
  getAccessoriesProductById,
  getAccessoriesProducts,
  updateAccessoriesProduct,
  addColorVariantController as addAccessoriesColorVariant,
  deleteProduct as deleteAccessoriesProduct,
} from "../controllers/admin/addProduct/accessories.controller.js";

const router = express.Router();

// ========== Slider Routes ==========
router.post("/sliderUpload", upload.array("file"), createSlider);
router.get("/sliderUpload", getSliders);
router.delete("/sliderUpload/:id", deleteSlider);

// ========== Pants Routes ==========
router.post(
  "/pantsUpload",
  upload.fields([{ name: "file", maxCount: 50 }]),
  createPantsProduct,
);
router.get("/pants", getPantsProducts);
router.put("/pants/:id", updatePantsProduct);
router.post(
  "/pants/colorVariant/:id",
  upload.array("file"),
  addPantsColorVariant,
);
router.post("/pants/delete", deletePantsProduct);

// ========== Shirts Routes ==========
router.post(
  "/shirtsUpload",
  upload.fields([{ name: "file", maxCount: 50 }]),
  createShirtsProduct,
);
router.get("/shirts", getShirtsProducts);
router.put("/shirts/:id", updateShirtsProduct);
router.get("/shirts/:id", getShirtsProductById);

router.post(
  "/shirts/colorVariant/:id",
  upload.array("file"),
  addShirtsColorVariant,
);
router.post("/shirts/delete", deleteShirtsProduct);

// ========== footwear Routes ==========

router.post(
  "/shoesUpload",
  upload.fields([{ name: "file", maxCount: 50 }]),
  createShoesProduct,
);
router.get("/footwear/:id", getFootwearProductById);

router.get("/shoes", getShoesProducts);
router.put("/shoes/:id", updateShoesProduct);
router.post(
  "/shoes/colorVariant/:id",
  upload.array("file"),
  addShoesColorVariant,
);
router.post("/shoes/delete", deleteShoesProduct);

// ========== Accessories Routes ==========
router.post(
  "/accessoriesUpload",
  upload.fields([{ name: "file", maxCount: 50 }]),
  createAccessoriesProduct,
);
router.get("/accessories/:id", getAccessoriesProductById);
router.get("/accessories", getAccessoriesProducts);
router.put("/accessories/:id", updateAccessoriesProduct);
router.post(
  "/accessories/colorVariant/:id",
  upload.array("file"),
  addAccessoriesColorVariant,
);
router.post("/accessories/delete", deleteAccessoriesProduct);

export default router;
