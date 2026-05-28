import {
  getAllProductsUserService,
  getOfferProductsService,
  getPantsProductByIdService,
  getTopProductsFull,
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
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const products = await getOfferProductsService(limit);
    res.status(200).json({
      success: true,
      count: products.length,
      products: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProductsUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const result = await getAllProductsUserService(page, limit);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTopProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const products = await getTopProductsFull(limit);
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
