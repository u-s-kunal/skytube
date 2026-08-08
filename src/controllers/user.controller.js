import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details fro the front-end
  const { fullname, email, password } = req.body;

  //validation not empty
  if ([fullname, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, `all field are required `);
  }
  //check if user already exist : username ,email
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "User with this email or Password already exist...!!!🤯",
    );
  }
  //check for image,check for avatar
  const avatarLoaclPath = req.file?.avatar[0]?.path;
  const coverImagePath = req.file?.coverImage[0]?.path;
  if (!avatarLoaclPath) {
    throw new ApiError(400, "Avatar Image Is Missing...!!!😤");
  }
  //upload them to cloudinary

  const avatar = await uploadOnCloudinary(avatarLoaclPath);
  const coverImage = await uploadOnCloudinary(coverImagePath);
  if (!avatar) {
    throw new ApiError(400, "Avatar Image Is Missing...!!!😠");
  }
  //create user object - create entry in DB
  const user = await User.create({
    username: username.toLowercase(),
    email,
    coverImage: coverImage?.url || "",
    avatar: avatar.url,
    fullname,
    password,
  });

  //remove password and refresh token filed from response
  const createUser = await User.findById(user._id).select(
    "-password -refreshToken",
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
  console.log(fullname, email, password, avatar);
});

export default registerUser;
