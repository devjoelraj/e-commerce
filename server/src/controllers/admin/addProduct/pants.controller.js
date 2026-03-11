import {
  getPantsProductsService,
  createPantsProductService,
  addColorVariantService,
} from "../../../services/admin/addProduct/pants.service.js";

export const createPantsProduct = async (req, res) => {
  try {
    if (!req.files.file || req.files.file.length === 0) {
      return res.status(400).json({
        message: "At least one image is required",
      });
    }

    const {
      productName,
      description,
      basePrice,
      discountPercentage,
      discountPrice,
      colors,
    } = req.body;

    let parsedColors = colors;

    if (typeof colors === "string") {
      parsedColors = JSON.parse(colors);
    }

    const colorImages = {};

    parsedColors.forEach((color) => {
      colorImages[color.name] = [];
    });

    // Since only one color, assign all files to it
    if (parsedColors.length > 0) {
      colorImages[parsedColors[0].name] = req.files.file;
    }

    const pantsProduct = await createPantsProductService({
      productName,
      description,
      basePrice,
      discountPercentage: discountPercentage || 0,
      discountPrice,
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
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addColorVariantController = async (req, res) => {
  try {
    const productId = req.params.id;
    const files = req.files;
    const { colors } = req.body;
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    console.log("PARAMS:", req.params);
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
