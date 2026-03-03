import {
  createPantsProductService,
  getPantsProductsService,
  getPantsProductByIdService,
  updatePantsProductService,
  deletePantsProductService,
  deleteProductImageService,
} from "../../../services/admin/addProduct/pants.service.js";

export const createPantsProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    const {
      productName,
      description,
      basePrice,
      discountPercentage,
      discountPrice,
      sizes,
      colors,
    } = req.body;

    let parsedColors = colors;
    let parsedSizes = sizes;

    if (typeof colors === "string") {
      parsedColors = JSON.parse(colors);
    }
    if (typeof sizes === "string") {
      parsedSizes = JSON.parse(sizes);
    }

    const colorImages = {};
    parsedColors.forEach((color) => {
      colorImages[color.name] = [];
    });

    req.files.forEach((file) => {
      const colorName = file.fieldname.match(/\[([^\]]+)\]/)?.[1];
      if (colorName && colorImages[colorName]) {
        colorImages[colorName].push(file);
      }
    });

    const pantsProduct = await createPantsProductService({
      productName,
      description,
      basePrice,
      discountPercentage: discountPercentage || 0,
      discountPrice,
      sizes: parsedSizes,
      colors: parsedColors,
      colorImages,
      userId: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: "Pants product created successfully",
      data: pantsProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPantsProducts = async (req, res) => {
  try {
    const { isActive } = req.query;
    const filters = {};
    if (isActive !== undefined) {
      filters.isActive = isActive === "true";
    }

    const products = await getPantsProductsService(filters);
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePantsProduct = async (req, res) => {
  try {
    let { sizes, colors, totalQuantity } = req.body;

    if (typeof sizes === "string") {
      try {
        sizes = JSON.parse(sizes);
      } catch (e) {
        return res.status(400).json({ message: "Invalid sizes format" });
      }
    }
    if (typeof colors === "string") {
      try {
        colors = JSON.parse(colors);
      } catch (e) {
        return res.status(400).json({ message: "Invalid colors format" });
      }
    }

    const updateData = { ...req.body, sizes, colors };

    if (totalQuantity !== undefined) {
      updateData.totalQuantity = Number(totalQuantity);
    }

    const updatedProduct = await updatePantsProductService(
      req.params.id,
      updateData,
    );
    res.json({
      success: true,
      message: "Pants product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePantsProduct = async (req, res) => {
  try {
    await deletePantsProductService(req.params.id);
    res.json({
      success: true,
      message: "Pants product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    const { productId, colorName, imageIndex } = req.body;

    if (!productId || !colorName || imageIndex === undefined) {
      return res.status(400).json({
        message: "productId, colorName, and imageIndex are required",
      });
    }

    const updatedProduct = await deleteProductImageService(
      productId,
      colorName,
      imageIndex,
    );

    res.json({
      success: true,
      message: "Image deleted successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
