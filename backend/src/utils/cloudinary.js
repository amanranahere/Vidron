import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";

const isVercel = process.env.VERCEL === "1";

const ffprobePath = isVercel ? ffprobeInstaller.path : ffprobeInstaller.path;
ffmpeg.setFfprobePath(ffprobePath);

console.log("Using FFprobe Path:", ffprobePath);

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

    console.log("Video Details:", videoDetails);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    console.error("Upload failed:", error);
    return null;
  }
};

export { uploadOnCloudinary, cloudinary };
