import {
  createSliderService,
  deleteSliderService,
  replaceSliderImageService,
} from "../../services/admin/sliders.service.js";

export const createSlider = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Images are required" });
    }

    if (!req.body.orders) {
      return res.status(400).json({ message: "Orders are required" });
    }

    const sliders = await createSliderService({
      files: req.files,
      orders: Array.isArray(req.body.orders)
        ? req.body.orders
        : [req.body.orders],
    });

    res.status(201).json({
      success: true,
      data: sliders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const replaceSliderImage = async (req, res) => {
  try {
    const slider = await replaceSliderImageService({
      id: req.params.id,
      fileBuffer: req.file.buffer,
      order: req.body.order,
    });

    res.json({ success: true, data: slider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteSlider = async (req, res) => {
  try {
    await deleteSliderService(req.params.id);

    res.json({ success: true, message: "Slider deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
