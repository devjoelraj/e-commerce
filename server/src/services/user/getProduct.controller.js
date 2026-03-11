import pantsModel from "../../models/admin/addProduct/pants.model.js";
import Shirts from "../../models/admin/addProduct/shirts.model.js";
import Pants from "../../models/admin/addProduct/pants.model.js";
import footWear from "../../models/admin/addProduct/footWear.model.js";
import Accessories from "../../models/admin/addProduct/accessories.model.js";

export const getPantsProductByIdService = async (id) => {
  const product = await pantsModel.findById(id).populate("createdBy", "email");
  if (!product) throw new Error("Pants product not found");
  return product;
};

export const getOfferProductsService = async () => {
  const [shirts, pants, footwear, accessories] = await Promise.all([
    Shirts.find({ isActive: true, offerProduct: true }).sort({ createdAt: -1 }),
    Pants.find({ isActive: true, offerProduct: true }).sort({ createdAt: -1 }),
    footWear
      .find({ isActive: true, offerProduct: true })
      .sort({ createdAt: -1 }),
    Accessories.find({ isActive: true, offerProduct: true }).sort({
      createdAt: -1,
    }),
  ]);

  const formattedProducts = [
    ...shirts.map((item) => ({ ...item.toObject(), category: "shirts" })),
    ...pants.map((item) => ({ ...item.toObject(), category: "pants" })),
    ...footwear.map((item) => ({ ...item.toObject(), category: "footwear" })),
    ...accessories.map((item) => ({
      ...item.toObject(),
      category: "accessories",
    })),
  ];

  return formattedProducts;
};
