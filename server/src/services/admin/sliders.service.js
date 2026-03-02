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

export const replaceSliderImageService = async ({ id, fileBuffer, order }) => {
  const currentSlider = await Slider.findById(id);
  if (!currentSlider) throw new Error("Slider not found");

  const existingSliderWithOrder = await Slider.findOne({
    order,
    _id: { $ne: id },
  });

  if (existingSliderWithOrder) {
    await deleteFromCloudinary(existingSliderWithOrder.publicId);
    await Slider.findByIdAndDelete(existingSliderWithOrder._id);
  }

  await deleteFromCloudinary(currentSlider.publicId);

  const uploaded = await uploadToCloudinary(fileBuffer);

  currentSlider.imageUrl = uploaded.imageUrl;
  currentSlider.publicId = uploaded.publicId;
  currentSlider.order = order;

  await currentSlider.save();

  return currentSlider;
};
export const deleteSliderService = async (id) => {
  const slider = await Slider.findById(id);
  if (!slider) throw new Error("Slider not found");

  await deleteFromCloudinary(slider.publicId);

  await slider.deleteOne();

  return true;
};
