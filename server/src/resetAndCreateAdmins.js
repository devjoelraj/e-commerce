import mongoose from "mongoose";
import User from "./models/user.model.js";
import Order from "./models/order.model.js";
import OfflineSale from "./models/offlineSale.model.js";
import dotenv from "dotenv";
import Shirts from "./models/admin/addProduct/shirts.model.js";
import Pants from "./models/admin/addProduct/pants.model.js";
import Footwear from "./models/admin/addProduct/footwear.model.js";
import Accessories from "./models/admin/addProduct/accessories.model.js";

dotenv.config();
// Helper: random integer between min and max inclusive
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Helper: random date within last N months (but within the current month window)
const randomDateInMonth = (monthsAgo) => {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  date.setDate(randomInt(1, 28)); // avoid month boundary issues
  return date;
};

// Helper: get a random product from the combined list
const getRandomProduct = (productsByCategory) => {
  const categories = Object.keys(productsByCategory);
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const arr = productsByCategory[cat];
  if (!arr.length) return null;
  const product = arr[Math.floor(Math.random() * arr.length)];
  return { ...product, category: cat };
};

// Main seeding function
const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Fetch all existing products (cached)
    const productsByCategory = {
      Shirts: await Shirts.find().lean(),
      Pants: await Pants.find().lean(),
      Footwear: await Footwear.find().lean(),
      Accessories: await Accessories.find().lean(),
    };
    console.log(
      `Found products: Shirts:${productsByCategory.Shirts.length}, Pants:${productsByCategory.Pants.length}, Footwear:${productsByCategory.Footwear.length}, Accessories:${productsByCategory.Accessories.length}`,
    );

    // Ensure there's at least one product
    const totalProducts = Object.values(productsByCategory).flat().length;
    if (totalProducts === 0) {
      throw new Error("No products found. Please add some products first.");
    }

    // Get or create a test user (admin) – used as userId and createdBy
    let user = await User.findOne({ email: "test@example.com" });
    if (!user) {
      user = await User.create({
        email: "test@example.com",
        username: "Test Admin",
        password: "hashed_password_placeholder", // not used for login, just for reference
        role: "admin",
        isVerified: true,
      });
      console.log("Created test admin user");
    }

    // Optional: clear existing data to avoid duplicates (comment out if you want to append)
    await Order.deleteMany({});
    await OfflineSale.deleteMany({});
    console.log("Cleared existing orders and offline sales");

    // We'll generate data for the last 6 months (months 0..5)
    const months = [0, 1, 2, 3, 4, 5]; // 0 = current month, 5 = 5 months ago
    const onlineOrders = [];
    const offlineSales = [];

    for (const monthsAgo of months) {
      // Generate 5-15 online orders per month
      const numOnline = randomInt(5, 15);
      for (let i = 0; i < numOnline; i++) {
        const product = getRandomProduct(productsByCategory);
        if (!product) continue;
        const price =
          product.pricing?.discountPrice || product.pricing?.basePrice;
        const quantity = randomInt(1, 3);
        const totalAmount = price * quantity;
        const orderDate = randomDateInMonth(monthsAgo);
        onlineOrders.push({
          userId: user._id,
          items: [
            {
              productId: product._id,
              category: product.category,
              productName: product.productName,
              color: product.colors?.[0]?.name || "default",
              size: product.category !== "Accessories" ? "M" : null,
              quantity,
              priceAtPurchase: price,
              image: product.colors?.[0]?.images?.[0]?.imageUrl || "",
            },
          ],
          totalAmount,
          shippingAddress: {
            fullName: "Test User",
            mobile: "1234567890",
            addressLine1: "123 Test St",
            city: "Test City",
            state: "TS",
            pincode: "123456",
          },
          orderStatus: "delivered",
          paymentStatus: "paid",
          createdAt: orderDate,
          updatedAt: orderDate,
        });
      }

      // Generate 3-10 offline sales per month
      const numOffline = randomInt(3, 10);
      for (let i = 0; i < numOffline; i++) {
        const product = getRandomProduct(productsByCategory);
        if (!product) continue;
        const basePrice =
          product.pricing?.discountPrice || product.pricing?.basePrice;
        // Random variation: 0.8 to 1.2 times base price
        const price = Math.round(basePrice * (0.8 + Math.random() * 0.6));
        const quantity = randomInt(1, 2);
        const saleDate = randomDateInMonth(monthsAgo);
        offlineSales.push({
          productId: product._id,
          category: product.category,
          productName: product.productName,
          color: product.colors?.[0]?.name || "default",
          size: product.category !== "Accessories" ? "M" : null,
          quantity,
          price,
          createdAt: saleDate,
          createdBy: user._id,
        });
      }
    }

    // Insert in batches to avoid performance issues
    if (onlineOrders.length) await Order.insertMany(onlineOrders);
    if (offlineSales.length) await OfflineSale.insertMany(offlineSales);

    console.log(`✅ Created ${onlineOrders.length} online orders (delivered)`);
    console.log(`✅ Created ${offlineSales.length} offline sales`);
    console.log("🎉 Seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
