import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ffprobe from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";

// Check if we are in a Vercel environment
const isVercel = process.env.VERCEL === "1";

// If running on Vercel, set a manual ffprobe path
const ffprobePath = isVercel ? "/usr/bin/ffprobe" : ffprobe.path;
ffmpeg.setFfprobePath(ffprobePath);

console.log("Using FFprobe Path:", ffprobePath); // Debugging log

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const videoDetails = await new Promise((resolve, reject) => {
      ffmpeg(localFilePath).ffprobe((err, data) => {
        if (err) {
          reject("Error fetching video details");
        } else {
          resolve(data);
        }
      });
    });

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error("Upload failed:", error);
    return null;
  }
};

export { uploadOnCloudinary, cloudinary };
