import Slider from "../../models/admin/uploadSlider.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.util.js";

export const createSliderService = async ({ files, orders }) => {
  if (files.length !== orders.length) {
    throw new Error("Each image must have an order value");
  }

  const uniqueOrders = new Set(orders);
  if (uniqueOrders.size !== orders.length) {
    throw new Error("Duplicate order values are not allowed");
  }

  const uploadPromises = files.map((file) => uploadToCloudinary(file.buffer));

  const uploadedImages = await Promise.all(uploadPromises);

  const slidersData = uploadedImages.map((img, index) => ({
    imageUrl: img.imageUrl,
    publicId: img.publicId,
    order: Number(orders[index]),
  }));

  const sliders = await Slider.insertMany(slidersData);

  return sliders;
};

export const deleteSliderService = async (id) => {
  const slider = await Slider.findById(id);
  if (!slider) throw new Error("Slider not found");

  await deleteFromCloudinary(slider.publicId);

  await slider.deleteOne();

  return true;
};

export const getAllSlidersService = async () => {
  return await Slider.find().sort({ order: 1 });
};

export const reorderSlidersService = async (updates) => {
  if (!Array.isArray(updates)) {
    throw new Error("Payload must be an array");
  }

  const orders = updates.map((u) => u.newOrder);
  if (new Set(orders).size !== orders.length) {
    throw new Error("Duplicate order values are not allowed");
  }

  const ops = updates.map((u) => ({
    updateOne: {
      filter: { _id: u.id },
      update: { $set: { order: u.newOrder } },
    },
  }));

  await Slider.bulkWrite(ops);
  return await Slider.find().sort({ order: 1 });
};
