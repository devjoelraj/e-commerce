import Slider from "../../../models/admin/addProduct/uploadSlider.model.js";

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
  const slider = await Slider.findById(id);

  if (!slider) {
    throw new Error("Slider not found");
  }

  await deleteFromCloudinary(slider.publicId);

  await Slider.findByIdAndDelete(id);

  const remaining = await Slider.find().sort({ order: 1 });

  for (let i = 0; i < remaining.length; i++) {
    remaining[i].order = i + 1;
    await remaining[i].save();
  }

  return true;
};
export const getAllSlidersService = async () => {
  return await Slider.find().sort({ order: 1 });
};
