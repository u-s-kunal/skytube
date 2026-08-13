import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
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
    $or: [{ username: userName }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User Does not exist..!!!🤓");
  }

  //password check

  const isPasswordValid = user.isPasswordCorrect(password);
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
    httpsOnly: true,
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
      $set: {
        refreshToken: undefined,
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
  const isPasswordCorrect = user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password...🙃");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password Changed😁"));
});

/////////GET CURRENT USER LOGIC FROM HERE ///////
const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(200, req.user, "Current User Fetched🤓");
});

/////////UPDATE ACCOUNT DETAILS LOGIC FROM HERE ///////

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required....");
  }

  const user = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true },
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account Details Updated successfully😃"));
});

/////////AVATAR UPDATE LOGIC FROM HERE ///////
const updateAvatar = asyncHandler(async (req, res) => {
  const avatarFilePath = req.file?.path;

  if (!avatarFilePath) {
    throw new ApiError(400, "Avatar is missing...😶");
  }

  const avatar = await uploadOnCloudinary(avatarFilePath);

  if (!avatar.url) {
    throw new ApiError(400, "Error While Updating Avatar....🫤");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { avatar: avatar.url },
    },
    {
      new: true,
    },
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, "Avatar Image Updated.... 🤩"));
});
/////////COVER IMAGE UPDATE LOGIC FROM HERE ///////
const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageFilePath = req.file?.path;

  if (!coverImageFilePath) {
    throw new ApiError(400, "Avatar is missing...😶");
  }

  const coverImage = await uploadOnCloudinary(coverImageFilePath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error While Updating Avatar....🫤");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { coverImage: coverImage.url },
    },
    {
      new: true,
    },
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, "Avatar Image Updated.... 🤩"));
});

/////////USER CHNANEL PROFLE  LOGIC FROM HERE ///////
const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) {
    throw new ApiError(400, "username is missing...");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subcriptions",
        localField: "_id",
        foreignField: "chennel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subcriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel not found..😞");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "channel fetch Sccessfull...🥳"));
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
  getUserChannelProfile,
  getWatchHistory,
};
