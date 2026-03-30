import ProductSearch from "../models/productSearch.model.js";
import { getEmbedding } from "./embedding.js";

export const addToSearchDB = async (product, category) => {
  // Include category and type for better context
  const text =
    `${product.productName || ""} ${product.description || ""} ${category} ${product.type || ""}`.trim();

  if (!text) {
    console.log("❌ Skipping empty product:", product._id);
    return;
  }

  const existing = await ProductSearch.findOne({ productId: product._id });
  if (existing) {
    console.log("⚠️ Already exists:", product.productName);
    return;
  }

  const embedding = await getEmbedding(text);
  if (!embedding) {
    console.log("❌ Embedding failed for:", product.productName);
    return;
  }

  await ProductSearch.create({
    productId: product._id,
    category,
    productName: product.productName,
    description: product.description,
    price: product.pricing.discountPrice,
    embedding,
  });
};
