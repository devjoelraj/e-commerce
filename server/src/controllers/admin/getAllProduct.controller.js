import {
  deleteProductImageService,
  deleteProductService,
  getAllProductsService,
  updateProductService,
} from "../../services/admin/getAllProduct.service.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await getAllProductsService();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId, colorName, imageIndex, category } = req.body;

    // DELETE SINGLE IMAGE
    if (imageIndex !== undefined) {
      if (!productId || !colorName || !category) {
        return res.status(400).json({
          success: false,
          message: "productId, category and colorName are required",
        });
      }

      const updatedProduct = await deleteProductImageService(
        category,
        productId,
        colorName,
        imageIndex,
      );

      return res.status(200).json({
        success: true,
        message: "Image deleted successfully",
        data: updatedProduct,
      });
    }

    // DELETE FULL PRODUCT
    if (!productId || !category) {
      return res.status(400).json({
        success: false,
        message: "productId and category are required",
      });
    }

    await deleteProductService(category, productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const result = await updateProductService(req.body);

    res.json({
      success: true,
      data: result,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
