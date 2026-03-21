import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/user.model.js";
import Order from "./models/order.model.js";
import Cart from "./models/cart.model.js";
import Address from "./models/address.model.js";
import dotenv from "dotenv";

dotenv.config();

const SALT_ROUNDS = 12;

const resetDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Delete all data (order matters to avoid foreign key issues)
    console.log("🗑️ Deleting all orders...");
    await Order.deleteMany({});
    console.log("🗑️ Deleting all carts...");
    await Cart.deleteMany({});
    console.log("🗑️ Deleting all addresses...");
    await Address.deleteMany({});
    console.log("🗑️ Deleting all users...");
    await User.deleteMany({});

    console.log("✅ All data deleted.");

    // Create admin user
    const adminData = {
      email: "admin@example.com",
      username: "Admin User",
      password: "Admin@123", // change to a strong password
      role: "admin",
      isVerified: true,
    };
    const hashedAdminPassword = await bcrypt.hash(
      adminData.password,
      SALT_ROUNDS,
    );
    const admin = new User({ ...adminData, password: hashedAdminPassword });
    await admin.save();
    console.log("✅ Admin user created:", admin.email);

    // Create superadmin user
    const superAdminData = {
      email: "superadmin@example.com",
      username: "Super Admin",
      password: "Super@123", // change to a strong password
      role: "superadmin",
      isVerified: true,
    };
    const hashedSuperPassword = await bcrypt.hash(
      superAdminData.password,
      SALT_ROUNDS,
    );
    const superAdmin = new User({
      ...superAdminData,
      password: hashedSuperPassword,
    });
    await superAdmin.save();
    console.log("✅ Superadmin user created:", superAdmin.email);

    console.log("🎉 Database reset and admin users created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

resetDatabase();
