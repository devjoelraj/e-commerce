import mongoose from "mongoose";

const shirtsSchema = new mongoose.Schema(
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
    offerProduct: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.model("shirts", shirtsSchema);
