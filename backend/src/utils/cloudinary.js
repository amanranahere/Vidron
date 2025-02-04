import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ffprobe from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";

// Set ffprobe path for fluent-ffmpeg
ffmpeg.setFfprobePath(ffprobe.path);

// Configuration for Cloudinary
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
      resource_type: "auto", // Automatically determines whether the file is an image, video, etc.
    });

    // File has been uploaded successfully, delete the local file
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // Remove the locally saved temporary file if the upload failed
    fs.unlinkSync(localFilePath);
    console.error("Upload failed:", error);
    return null;
  }
};

export { uploadOnCloudinary, cloudinary };
