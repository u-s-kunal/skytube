import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

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

export { registerUser, loginUser, logOutUser, refreshAccessToken };
