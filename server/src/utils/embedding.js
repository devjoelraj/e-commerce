import { pipeline } from "@xenova/transformers";

let extractor;

// Load model once
const loadModel = async () => {
  if (!extractor) {
    console.log("🔄 Loading embedding model...");
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("✅ Embedding model loaded");
  }
};

export const getEmbedding = async (text) => {
  try {
    await loadModel();

    if (!text || text.trim() === "") {
      console.log("❌ Empty text");
      return null;
    }

    // Truncate text to avoid token limits (512 tokens is safe for this model)
    const truncatedText = text.slice(0, 500);

    const output = await extractor(truncatedText, {
      pooling: "mean",
      normalize: true,
    });

    const embedding = Array.from(output.data);
    return embedding;
  } catch (err) {
    console.error("❌ Embedding error:", err);
    return null;
  }
};
