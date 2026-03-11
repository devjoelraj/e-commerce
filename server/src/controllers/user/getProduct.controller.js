import {
  getOfferProductsService,
  getPantsProductByIdService,
} from "../../services/user/getProduct.controller.js";

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getPantsProductByIdService(id);
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOfferProducts = async (req, res) => {
  try {
    const products = await getOfferProductsService();
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
