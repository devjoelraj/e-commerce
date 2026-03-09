import mongoose from "mongoose";

const accessoriesSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    // Type field for watch/chain/ring
    type: {
      type: String,
      enum: ["watch", "chain", "ring"],
      required: true,
      default: "watch",
    },

    pricing: {
      basePrice: { type: Number, required: true },
      discountPercentage: { type: Number, default: 0 },
      discountPrice: { type: Number, required: true },
    },

    colors: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true },
        images: [
          {
            imageUrl: { type: String, required: true },
            publicId: { type: String, required: true },
          },
        ],
      },
    ],

    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("accessories", accessoriesSchema);
