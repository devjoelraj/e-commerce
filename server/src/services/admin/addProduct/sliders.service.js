import Slider from "../../../models/admin/addProduct/uploadSlider.model.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../../utils/cloudinary.util.js";

export const createSliderService = async ({ files, orders }) => {
  if (files.length !== orders.length) {
    throw new Error("Each image must have an order value");
  }

  orders = orders.map((o) => Number(o));

  const uniqueOrders = new Set(orders);
  if (uniqueOrders.size !== orders.length) {
    throw new Error("Duplicate order values are not allowed");
  }

  const existingOrders = await Slider.find({
    order: { $in: orders },
  });

  if (existingOrders.length > 0) {
    throw new Error("One or more order numbers already exist in database");
  }

  const uploadPromises = files.map((file) => uploadToCloudinary(file.buffer));

  const uploadedImages = await Promise.all(uploadPromises);

  const slidersData = uploadedImages.map((img, index) => ({
    imageUrl: img.imageUrl,
    publicId: img.publicId,
    order: orders[index],
  }));

  const sliders = await Slider.insertMany(slidersData);

  return sliders;
};

export const deleteSliderService = async (id) => {
  try {
    console.log("Delete request ID:", id);

    const slider = await Slider.findById(id);
    console.log("Slider found:", slider);

    if (!slider) {
      throw new Error("Slider not found");
    }

    console.log("Deleting from cloudinary:", slider.publicId);
    await deleteFromCloudinary(slider.publicId);

    console.log("Deleting from database");
    await Slider.findByIdAndDelete(id);

    console.log("Reordering sliders...");

    const remaining = await Slider.find().sort({ order: 1 });
    console.log("Remaining sliders:", remaining);

    for (let i = 0; i < remaining.length; i++) {
      remaining[i].order = i + 1;
      await remaining[i].save();
      console.log(`Updated order for ${remaining[i]._id} -> ${i + 1}`);
    }

    console.log("Delete completed successfully");

    return true;
  } catch (error) {
    console.error("DELETE SLIDER SERVICE ERROR:", error);
    throw error;
  }
};
export const getAllSlidersService = async () => {
  return await Slider.find().sort({ order: 1 });
};
