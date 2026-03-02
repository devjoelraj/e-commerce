import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT || 5000;
export const accessTokenSecret = process.env.JWT_SECRET;
export const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
export const frontendUrl = process.env.FRONTEND_URL;
export const dbConnectionString = process.env.MONGO_URI;
export const nodeEnv = process.env.NODE_ENV;
export const emailUser = process.env.EMAIL_USER;
export const emailPass = process.env.EMAIL_PASS;
export const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
export const cloudApiKey = process.env.CLOUDINARY_API_KEY;
export const cloudApiSecret = process.env.CLOUDINARY_API_SECRET;
