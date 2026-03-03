import express from "express";

import upload from "../middlewares/multer.js";
import {
  createSlider,
  deleteSlider,
  getSliders,
  reorderSliders,
} from "../controllers/admin/sliders.controller.js";

const router = express.Router();

router.post("/sliderUpload", upload.array("file"), createSlider);
router.get("/sliderUpload", getSliders);
router.put("/sliderUpload/reorder", express.json(), reorderSliders);
router.delete("/sliderUpload/:id", deleteSlider);

export default router;
