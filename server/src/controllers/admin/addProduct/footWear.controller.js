import {
  createShoesProductService,
  getShoesProductsService,
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
    const { isActive, type, page = 1, limit = 15 } = req.query;

    const filters = {};
    if (isActive !== undefined) {
      filters.isActive = isActive === "true";
    }
    if (type !== undefined) {
      filters.type = type;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const result = await getShoesProductsService(filters, pageNum, limitNum);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFootwearProductById = async (req, res) => {
  try {
    const product = await getFootwearProductByIdService(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
