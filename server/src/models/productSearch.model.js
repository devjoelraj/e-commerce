import mongoose from "mongoose";

const productSearchSchema = new mongoose.Schema(
  {
    productId: mongoose.Schema.Types.ObjectId,
    category: String,

    productName: String,
    description: String,

    price: Number,

    embedding: {
      type: [Number],
    },
  },
  { timestamps: true },
);

export default mongoose.model("ProductSearch", productSearchSchema);
