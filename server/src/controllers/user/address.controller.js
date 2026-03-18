import {
  getUserAddress,
  upsertAddress,
} from "../../services/user/address.service.js";

// GET /user/address – fetch the user's address (single)
export const getAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const address = await getUserAddress(userId);
    res.json({ success: true, data: address || null });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /user/address – create or update the user's address
export const saveAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const addressData = req.body;
    const address = await upsertAddress(userId, addressData);
    res.status(200).json({ success: true, data: address });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
