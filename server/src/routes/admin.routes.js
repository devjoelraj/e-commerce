import express from "express";

import upload from "../middlewares/multer.js";
import {
  createSlider,
  deleteSlider,
  getSliders,
  reorderSliders,
} from "../controllers/admin/sliders.controller.js";
import {
  createPantsProduct,
  getPantsProducts,
  getPantsProductById,
  updatePantsProduct,
  deletePantsProduct,
  deleteProductImage,
} from "../controllers/admin/addProduct/pants.controller.js";

const router = express.Router();

router.post("/sliderUpload", upload.array("file"), createSlider);
router.get("/sliderUpload", getSliders);
router.put("/sliderUpload/reorder", express.json(), reorderSliders);
router.delete("/sliderUpload/:id", deleteSlider);

router.post(
  "/pantsUpload",
  upload.fields([{ name: "file", maxCount: 50 }]),
  createPantsProduct,
);
router.get("/pants", getPantsProducts);
router.put("/pants/:id", express.json(), updatePantsProduct);
router.delete("/pants/:id", deletePantsProduct);
router.post("/pants/image/delete", express.json(), deleteProductImage);

export default router;
