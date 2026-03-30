import ProductSearch from "../../models/productSearch.model.js";
import { getEmbedding } from "../../utils/embedding.js";
import Shirts from "../../models/admin/addProduct/shirts.model.js";
import Pants from "../../models/admin/addProduct/pants.model.js";
import Footwear from "../../models/admin/addProduct/footwear.model.js";
import Accessories from "../../models/admin/addProduct/accessories.model.js";

// Map category to the correct model
const getProductModel = (category) => {
  const modelMap = {
    shirts: Shirts,
    pants: Pants,
    footwear: Footwear,
    accessories: Accessories,
  };
  return modelMap[category];
};

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Query is required" });
    }

    console.log("🔍 Search query:", query);

    // Convert query text to embedding
    const queryVector = await getEmbedding(query);
    if (!queryVector) {
      console.error("❌ Embedding generation failed");
      return res
        .status(500)
        .json({ success: false, message: "Embedding failed" });
    }

    console.log("📊 Query vector length:", queryVector.length);

    // Perform vector search with similarity score
    const searchResults = await ProductSearch.aggregate([
      {
        $vectorSearch: {
          index: "vector_index_1",
          path: "embedding",
          queryVector,
          numCandidates: 200, // Higher for better recall
          limit: 30, // Get more candidates, we'll filter by similarity
        },
      },
      {
        $addFields: {
          similarity: { $meta: "vectorSearchScore" },
        },
      },
      {
        $match: {
          similarity: { $gt: 0.65 }, // Only keep results with >65% similarity
        },
      },
      {
        $sort: { similarity: -1 }, // Highest similarity first
      },
      {
        $limit: 20, // Final limit
      },
      {
        $project: {
          embedding: 0, // Remove embedding from results
        },
      },
    ]);

    console.log(
      `📦 Vector search returned ${searchResults.length} results after filtering`,
    );

    if (searchResults.length === 0) {
      return res.json({ success: true, products: [] });
    }

    // Fetch full product details from original models
    const fullProducts = await Promise.all(
      searchResults.map(async (result) => {
        const Model = getProductModel(result.category);
        if (!Model) {
          console.warn(`No model found for category: ${result.category}`);
          return null;
        }

        const product = await Model.findById(result.productId).lean();
        if (!product) {
          console.warn(`Product not found: ${result.productId}`);
          return null;
        }

        // Normalize category for frontend (capitalized)
        let normalizedCategory;
        switch (result.category) {
          case "shirts":
            normalizedCategory = "Shirts";
            break;
          case "pants":
            normalizedCategory = "Pants";
            break;
          case "footwear":
            normalizedCategory = "Footwear";
            break;
          case "accessories":
            normalizedCategory = "Accessories";
            break;
          default:
            normalizedCategory = result.category;
        }

        return {
          ...product,
          category: normalizedCategory,
        };
      }),
    );

    // Filter out any null results
    const validProducts = fullProducts.filter((p) => p !== null);

    console.log(`✅ Returning ${validProducts.length} products`);

    res.json({ success: true, products: validProducts });
  } catch (err) {
    console.error("❌ Search error:", err);
    res.status(500).json({ success: false, message: "Search failed" });
  }
};
