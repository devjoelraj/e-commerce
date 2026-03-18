import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    pincode: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: String,
    landmark: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.Address ||
  mongoose.model("Address", addressSchema);
