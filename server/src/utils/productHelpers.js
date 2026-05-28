import Pants from "../models/admin/addProduct/pants.model.js";
import Shirts from "../models/admin/addProduct/shirts.model.js";
import Footwear from "../models/admin/addProduct/footWear.model.js";
import Accessories from "../models/admin/addProduct/accessories.model.js";

export const getProductModel = (category) => {
  const map = {
    Pants,
    Shirts,
    Footwear,
    Accessories,
  };
  if (!map[category]) throw new Error("Invalid category");
  return map[category];
};
