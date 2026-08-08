import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
console.log("API_KEY:", process.env.API_KEY);
console.log("API_SECRET:", process.env.API_SECRET ? "Loaded" : "Missing");

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log("cloudinary  workig perfectly...🥳", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //removes locally saved file as operation failed...
    console.log("cloudinary not workig...😞", error);
    return null;
  }
};

export default uploadOnCloudinary;
