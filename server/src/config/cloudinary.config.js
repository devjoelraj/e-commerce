import { v2 as cloudinary } from "cloudinary";
import {
  cloudName,
  cloudApiKey,
  cloudApiSecret,
} from "../config/env.config.js";

cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudApiKey,
  api_secret: cloudApiSecret,
});

export default cloudinary;
