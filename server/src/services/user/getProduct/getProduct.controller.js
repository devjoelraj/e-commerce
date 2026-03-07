import pantsModel from "../../../models/admin/addProduct/pants.model.js";

export const getPantsProductByIdService = async (id) => {
  const product = await pantsModel.findById(id).populate("createdBy", "email");
  if (!product) throw new Error("Pants product not found");
  return product;
};
