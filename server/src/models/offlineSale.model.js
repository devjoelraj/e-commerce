import mongoose from "mongoose";

const offlineSaleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  category: { type: String, required: true },
  productName: { type: String, required: true },
  color: { type: String, required: true },
  size: { type: String, default: null },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.models.OfflineSale ||
  mongoose.model("OfflineSale", offlineSaleSchema);
