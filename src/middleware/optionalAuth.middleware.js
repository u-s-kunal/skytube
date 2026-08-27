import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const optionalJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next();
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken",
    );

    if (user) {
      req.user = user;
    }
  } catch (error) {
    console.error("Optional authentication failed:", error.message);
  }

  next();
};
