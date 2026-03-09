import {
  createSliderService,
  deleteSliderService,
  getAllSlidersService,
} from "../../../services/admin/addProduct/sliders.service.js";

export const createSlider = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Images are required" });
    }

    if (!req.body.orders) {
      return res.status(400).json({ message: "Orders are required" });
    }

    let orders = req.body.orders;
    if (typeof orders === "string") {
      try {
        orders = JSON.parse(orders);
      } catch (e) {
        orders = orders.split(",").map((s) => s.trim());
      }
    }

    if (!Array.isArray(orders)) {
      orders = [orders];
    }

    const sliders = await createSliderService({
      files: req.files,
      orders,
    });

    res.status(201).json({
      success: true,
      data: sliders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSliders = async (req, res) => {
  try {
    const sliders = await getAllSlidersService();
    res.json({ success: true, data: sliders });
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
