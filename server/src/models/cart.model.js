import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  category: { type: String, required: true },

  color: { type: String, required: true },
  size: { type: String, default: null },

  quantity: { type: Number, required: true },

  priceAtAdded: Number,

  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    items: [cartItemSchema],
  },
  { timestamps: true },
);

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
