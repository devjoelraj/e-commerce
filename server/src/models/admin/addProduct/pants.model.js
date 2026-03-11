import mongoose from "mongoose";

const pantsSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    pricing: {
      basePrice: {
        type: Number,
        required: true,
      },
      discountPercentage: {
        type: Number,
        default: 0,
      },
      discountPrice: {
        type: Number,
        required: true,
      },
    },

    colors: [
      {
        name: {
          type: String,
          required: true,
        },

        hex: {
          type: String,
          required: true,
        },

        sizes: [
          {
            size: {
              type: String,
              required: true,
            },
            qty: {
              type: Number,
              required: true,
            },
          },
        ],

        images: [
          {
            imageUrl: {
              type: String,
              required: true,
            },
            publicId: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],

    totalQuantity: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    offerProduct: { type: Boolean, default: false },
  },

  { timestamps: true },
);

export default mongoose.model("Pants", pantsSchema);
