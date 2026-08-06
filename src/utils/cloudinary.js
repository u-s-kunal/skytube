import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: "voyikrru",
  api_key: "414627594723672",
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("cloudinary  workig perfectly...🥳", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //removes locally saved file as operation failed...
    console.log("cloudinary not workig...😞", error);
    return null;
  }
};

export default uploadOnCloudinary;
