import mongoose from "mongoose";
import dotenv from "dotenv";
import ProductSearch from "./models/productSearch.model.js";
import Shirts from "./models/admin/addProduct/shirts.model.js";
import Pants from "./models/admin/addProduct/pants.model.js";
import Footwear from "./models/admin/addProduct/footWear.model.js";
import Accessories from "./models/admin/addProduct/accessories.model.js";
import { getEmbedding } from "./utils/embedding.js";

dotenv.config();

async function regenerateEmbeddingsForModel(Model, category) {
  const products = await Model.find({ isActive: true });
  console.log(`Processing ${products.length} products for ${category}...`);

  for (const product of products) {
    // Include product name, description, category, and type for richer context
    const text =
      `${product.productName || ""} ${product.description || ""} ${category} ${product.type || ""}`.trim();

    const embedding = await getEmbedding(text);
    if (embedding) {
      await ProductSearch.findOneAndUpdate(
        { productId: product._id },
        {
          productId: product._id,
          category,
          productName: product.productName,
          description: product.description,
          price: product.pricing?.discountPrice || product.pricing?.basePrice,
          embedding,
        },
        { upsert: true },
      );
      console.log(`✅ Embedded ${category}: ${product.productName}`);
    } else {
      console.log(`❌ Failed to embed ${category}: ${product.productName}`);
    }
  }
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing search data
    await ProductSearch.deleteMany({});
    console.log("🗑️ Cleared existing ProductSearch collection");

    // Regenerate embeddings for all categories
    await regenerateEmbeddingsForModel(Shirts, "shirts");
    await regenerateEmbeddingsForModel(Pants, "pants");
    await regenerateEmbeddingsForModel(Footwear, "footwear");
    await regenerateEmbeddingsForModel(Accessories, "accessories");

    console.log("🎉 All embeddings regenerated successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

run();
