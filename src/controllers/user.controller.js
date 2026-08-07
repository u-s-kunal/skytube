import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details fro the front-end
  const { fullname, email, avatar, password } = req.body;

  //validation not empty
  if (
    [fullname, email, avatar, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, `all field are required `);
  }
  //check if user already exist : username ,email
  //check for image,check for avatar
  //upload them to cloudinary
  //create user object - create entry in DB
  //remove password and refresh token filed from response
  //check for user creation
  // res
  console.log(fullname, email, password, avatar);
});

export default registerUser;
