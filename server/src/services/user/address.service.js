import Address from "../../models/address.model.js";

// Get the single address for a user (returns null if none)
export const getUserAddress = async (userId) => {
  return await Address.findOne({ userId });
};

// Create or update the address for a user (upsert)
export const upsertAddress = async (userId, addressData) => {
  const address = await Address.findOneAndUpdate(
    { userId },
    { $set: addressData },
    { new: true, upsert: true },
  );
  return address;
};
