import {
  createAccessoriesProductService,
  getAccessoriesProductsService,
  updateAccessoriesProductService,
  deleteAccessoriesProductService,
  deleteProductImageService,
  addColorVariantService,
} from "../../../services/admin/addProduct/accessories.service.js";

// ---------- CREATE PRODUCT ----------
export const createAccessoriesProduct = async (req, res) => {
  try {
    if (!req.files?.file || req.files.file.length === 0) {
      return res.status(400).json({
        message: "At least one image is required",
      });
    }

    const {
      productName,
      description,
      type,
      basePrice,
      discountPercentage,
      discountPrice,
      colors,
    } = req.body;

    let parsedColors = colors;
    if (typeof colors === "string") {
      try {
        parsedColors = JSON.parse(colors);
      } catch (e) {
        return res.status(400).json({ message: "Invalid colors format" });
      }
    }

    const colorImages = {};
    parsedColors.forEach((color) => {
      colorImages[color.name] = [];
    });
    if (parsedColors.length > 0) {
      colorImages[parsedColors[0].name] = req.files.file;
    }

    const product = await createAccessoriesProductService({
      productName,
      description,
      type,
      basePrice,
      discountPercentage: discountPercentage || 0,
      discountPrice,
      colors: parsedColors,
      colorImages,
      userId: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: "Accessories product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------- ADD COLOR VARIANT ----------
export const addColorVariantController = async (req, res) => {
  try {
    const productId = req.params.id;
    const files = req.files;
    const { colors } = req.body;

    const product = await addColorVariantService(productId, colors, files);

    res.status(200).json({
      success: true,
      message: "Color variant added successfully",
      product,
    });
  } catch (error) {
    console.error("Add Color Variant Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------- GET ALL PRODUCTS ----------
export const getAccessoriesProducts = async (req, res) => {
  try {
    const { isActive, type } = req.query;
    const filters = {};
    if (isActive !== undefined) filters.isActive = isActive === "true";
    if (type !== undefined) filters.type = type;

    const products = await getAccessoriesProductsService(filters);
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- UPDATE PRODUCT ----------
export const updateAccessoriesProduct = async (req, res) => {
  try {
    // No sizes or totalQuantity handling
    const updateData = { ...req.body };

    const updatedProduct = await updateAccessoriesProductService(
      req.params.id,
      updateData,
    );
    res.json({
      success: true,
      message: "Accessories product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- DELETE PRODUCT OR IMAGE ----------
export const deleteProduct = async (req, res) => {
  try {
    const { productId, colorName, imageIndex } = req.body;

    if (imageIndex !== undefined) {
      // Delete a single image from a color variant
      if (!productId || !colorName) {
        return res.status(400).json({
          message: "productId and colorName are required for image deletion",
        });
      }

      const updatedProduct = await deleteProductImageService(
        productId,
        colorName,
        imageIndex,
      );

      return res.json({
        success: true,
        message: "Image deleted successfully",
        data: updatedProduct,
      });
    } else {
      // Delete the entire product
      const idToDelete = productId || req.params.id;
      if (!idToDelete) {
        return res.status(400).json({
          message: "productId or id parameter is required for product deletion",
        });
      }

      await deleteAccessoriesProductService(idToDelete);

      return res.json({
        success: true,
        message: "Accessories product deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
