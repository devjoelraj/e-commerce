import cloudinary from "../config/cloudinary.config.js";

export const uploadToCloudinary = async (fileBuffer, folder = "sliders") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    stream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error("Cloudinary delete failed");
  }
};
