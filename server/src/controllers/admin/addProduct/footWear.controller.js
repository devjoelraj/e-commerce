import {
  createShoesProductService,
  getShoesProductsService,
  updateShoesProductService,
  deleteShoesProductService,
  deleteProductImageService,
  addColorVariantService,
} from "../../../services/admin/addProduct/footwear.service.js";

export const createShoesProduct = async (req, res) => {
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

    const shoesProduct = await createShoesProductService({
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
      message: "Shoes product created successfully",
      data: shoesProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getShoesProducts = async (req, res) => {
  try {
    const { isActive, type } = req.query;
    const filters = {};
    if (isActive !== undefined) {
      filters.isActive = isActive === "true";
    }
    if (type !== undefined) {
      filters.type = type;
    }

    const products = await getShoesProductsService(filters);
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateShoesProduct = async (req, res) => {
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

    const updatedProduct = await updateShoesProductService(
      req.params.id,
      updateData,
    );
    res.json({
      success: true,
      message: "Shoes product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId, colorName, imageIndex } = req.body;

    if (imageIndex !== undefined) {
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
      const idToDelete = productId || req.params.id;
      if (!idToDelete) {
        return res.status(400).json({
          message: "productId or id parameter is required for product deletion",
        });
      }

      await deleteShoesProductService(idToDelete);

      return res.json({
        success: true,
        message: "Shoes product deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
