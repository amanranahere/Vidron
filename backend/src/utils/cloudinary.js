import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ffprobe from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";

// Manually set a fallback path
const ffprobePath = ffprobe.path || "/usr/bin/ffprobe";
ffmpeg.setFfprobePath(ffprobePath);

console.log("FFprobe Path:", ffprobePath); // Debugging log

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload video to Cloudinary with video processing
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Check video properties using ffprobe
    const videoDetails = await new Promise((resolve, reject) => {
      ffmpeg(localFilePath).ffprobe((err, data) => {
        if (err) {
          reject("Error fetching video details");
        } else {
          resolve(data);
        }
      });
    });

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Delete local file after successful upload
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error("Upload failed:", error);
    return null;
  }
};

export { uploadOnCloudinary, cloudinary };
