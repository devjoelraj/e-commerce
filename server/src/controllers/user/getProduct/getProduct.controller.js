import { getPantsProductByIdService } from "../../../services/user/getProduct/getProduct.controller.js";

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
