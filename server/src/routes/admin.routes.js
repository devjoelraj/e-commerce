import express from "express";

import upload from "../middlewares/multer.js";
import {
  createSlider,
  deleteSlider,
  getSliders,
} from "../controllers/admin/sliders.controller.js";
import {
  createPantsProduct,
  getPantsProducts,
  updatePantsProduct,
  deletePantsProduct,
  deleteProductImage,
  addColorVariantController,
} from "../controllers/admin/addProduct/pants.controller.js";

const router = express.Router();

router.post("/sliderUpload", upload.array("file"), createSlider);
router.get("/sliderUpload", getSliders);
router.delete("/sliderUpload/:id", deleteSlider);

router.post(
  "/pantsUpload",
  upload.fields([{ name: "file", maxCount: 50 }]),
  createPantsProduct,
);
router.get("/pants", getPantsProducts);
router.put("/pants/:id", express.json(), updatePantsProduct);
router.post(
  "/pants/colorVariant/:id",
  upload.array("file"),
  addColorVariantController,
);
router.delete("/pants/:id", deletePantsProduct);
router.post("/pants/image/delete", express.json(), deleteProductImage);

export default router;
