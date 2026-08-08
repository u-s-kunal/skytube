import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details fro the front-end
  const { fullName, email, password, userName } = req.body;

  //validation not empty
  if ([fullName, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, `all field are required `);
  }
  //check if user already exist : userName ,email
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "User with this email or Password already exist...!!!🤯",
    );
  }
  //check for image,check for avatar

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar Image Is Missing...!!!😤");
  }
  //upload them to cloudinary

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar Image Is Missing...!!!😠");
  }
  //create user object - create entry in DB
  const user = await User.create({
    userName: userName.toLowerCase(),
    email,
    coverImage: coverImage?.url || "",
    avatar: avatar.url,
    fullName,
    password,
  });

  //remove password and refresh token filed from response
  const createUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(201)
    .json(
      new ApiResponse(201, createUser, "User registration Successful...!!!😁"),
    );

  //check for user creation
  if (!createUser) {
    throw new ApiError(500, "Failed registration of User...!!!🥲");
  }

  // response
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        createdUser,
        "User registration Scuccessfull...!!!😁",
      ),
    );
  console.log(fullName, email, password, avatar);
});

export default registerUser;
