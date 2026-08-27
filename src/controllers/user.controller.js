import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

/////////USER REGISTRATION LOGIC FROM HERE ///////

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
      "User with this email or userName already exist...!!!🤯",
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

/////////USER LOGIN LOGIC FROM HERE ///////

const loginUser = asyncHandler(async (req, res) => {
  //res body -> data

  const { email, password, userName } = req.body;

  //userName or email
  if (!userName && !email) {
    throw new ApiError(400, "UserName and email required...!!!🧐");
  }

  //find the user
  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  //password check

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Password is incorrect..!!!🤨");
  }

  //access and refresh token
  const generateAccessAndRefreshToken = async (userId) => {
    try {
      const user = await User.findOne(userId);
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(
        500,
        "SomeThing went Wrong while creating access or refresh Token🥹",
      );
    }
  };

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  //send cookie
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully...!!😎",
      ),
    );
});
/////////USER LOGOUT LOGIC FROM HERE ///////

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});
/////////REFRESH TOKEN LOGIC FROM HERE ///////

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id,
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "Access token refreshed successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

/////////CHANGE CURRENT PASSWORD LOGIC FROM HERE ///////
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password...🙃");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password Changed😁"));
});

/////////GET CURRENT USER LOGIC FROM HERE ///////
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User Fetched successfully"));
});

/////////UPDATE ACCOUNT DETAILS LOGIC FROM HERE ///////

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, userName } = req.body;

  if (!fullName?.trim() || !email?.trim() || !userName?.trim()) {
    throw new ApiError(400, "Full name, username and email are required");
  }

  const existingUser = await User.findOne({
    userName: userName.toLowerCase(),
    _id: { $ne: req.user._id },
  });

  if (existingUser) {
    throw new ApiError(409, "Username is already taken");
  }

  const existingEmail = await User.findOne({
    email: email.toLowerCase(),
    _id: { $ne: req.user._id },
  });

  if (existingEmail) {
    throw new ApiError(409, "Email is already in use");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName: fullName.trim(),
        userName: userName.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
      },
    },
    {
      new: true,
    },
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

/////////AVATAR UPDATE LOGIC FROM HERE ///////
const updateAvatar = asyncHandler(async (req, res) => {
  const avatarFilePath = req.file?.path;

  if (!avatarFilePath) {
    throw new ApiError(400, "Avatar image is required");
  }

  const avatar = await uploadOnCloudinary(avatarFilePath);

  if (!avatar?.url) {
    throw new ApiError(500, "Failed to upload avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    },
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

/////////COVER IMAGE UPDATE LOGIC FROM HERE ///////
const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageFilePath = req.file?.path;

  if (!coverImageFilePath) {
    throw new ApiError(400, "Cover image is required");
  }

  const coverImage = await uploadOnCloudinary(coverImageFilePath);

  if (!coverImage?.url) {
    throw new ApiError(500, "Failed to upload cover image");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    {
      new: true,
    },
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

/////////USER CHNANEL PROFLE  LOGIC FROM HERE ///////
const getUserChannelProfile = asyncHandler(async (req, res) => {
  // 1. Get username from URL
  const { username } = req.params;

  // 2. Validate username
  if (!username?.trim()) {
    throw new ApiError(400, "Username is required");
  }

  // 3. Find channel
  const channel = await User.findOne({
    userName: username.toLowerCase(),
  }).select("fullName userName avatar coverImage");

  // 4. Check if channel exists
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  // 5. Get subscriber count
  const subscribersCount = await Subscription.countDocuments({
    channel: channel._id,
  });

  // 6. Get subscriptions count
  const channelsSubscribedToCount = await Subscription.countDocuments({
    subscriber: channel._id,
  });

  // 7. Check whether logged-in user
  //    is subscribed to this channel
  const existingSubscription = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channel._id,
  });

  // 8. Prepare channel response
  const channelProfile = {
    _id: channel._id,
    fullName: channel.fullName,
    userName: channel.userName,
    avatar: channel.avatar,
    coverImage: channel.coverImage,

    subscribersCount,

    channelsSubscribedToCount,

    isSubscribed: !!existingSubscription,
  };

  // 9. Return response
  return res
    .status(200)
    .json(new ApiResponse(200, channelProfile, "Channel fetched successfully"));
});

/////////GETTING WATCH HISTORY LOGIC FROM HERE ///////
const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch History fetched SuccessFully😇",
      ),
    );
});

/////////REMOVE AVATAR LOGIC FROM HERE ///////
const removeAvatar = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: "",
      },
    },
    {
      new: true,
    },
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar removed successfully"));
});

/////////REMOVE COVER IMAGE LOGIC FROM HERE ///////
const removeCoverImage = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: "",
      },
    },
    {
      new: true,
    },
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image removed successfully"));
});

export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  removeAvatar,
  removeCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
