import express from "express";

import upload from "../middlewares/multer.js";
import {
  createSlider,
  deleteSlider,
  replaceSliderImage,
} from "../controllers/admin/sliders.controller.js";

const router = express.Router();

router.post("/sliderUpload", upload.array("file"), createSlider);
router.put("/sliderUpload/:id", upload.single("image"), replaceSliderImage);
router.delete("/sliderUpload/:id", deleteSlider);

export default router;
