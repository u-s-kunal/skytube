import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  // 1. Get tweet content from request body
  const { content } = req.body;

  // 2. Validate tweet content
  if (!content?.trim()) {
    throw new ApiError(400, "Tweet content is required");
  }

  // 3. Create tweet
  const tweet = await Tweet.create({
    content: content.trim(),
    owner: req.user._id,
  });

  // 4. Populate safe owner information
  await tweet.populate("owner", "userName fullName avatar");

  // 5. Return response
  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // 1. Get user ID from URL
  const { userId } = req.params;

  // 2. Validate user ID
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  // 3. Check if user exists
  const user = await User.findById(userId);

  // 4. Get user's tweets
  const tweets = await Tweet.find({
    owner: userId,
  })
    .populate("owner", "userName fullName avatar")
    .sort({ createdAt: -1 });

  // 5. Return response
  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  // 1. Get tweet ID from URL
  const { tweetId } = req.params;

  // 2. Get new content from request body
  const { content } = req.body;

  // 3. Validate tweet ID
  if (!mongoose.isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  // 4. Validate tweet content
  if (!content?.trim()) {
    throw new ApiError(400, "Tweet content is required");
  }

  // 5. Find tweet
  const tweet = await Tweet.findById(tweetId);
  // 6. Check if tweet exists
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  // 7. Check if logged-in user owns the tweet
  if (!tweet.owner.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorized to update this tweet");
  }

  // 8. Update tweet content
  tweet.content = content.trim();

  // 9. Save changes
  await tweet.save();

  // 10. Populate safe owner information
  await tweet.populate("owner", "userName fullName avatar");

  // 11. Return updated tweet
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  // 1. Get tweet ID from URL
  const { tweetId } = req.params;
  // 2. Validate tweet ID
  if (!mongoose.isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  // 3. Find tweet
  const tweet = await Tweet.findById(tweetId);

  // 4. Check if tweet exists
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }
  // 5. Check if logged-in user owns the tweet
  if (!tweet.owner.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorized to delete this tweet");
  }

  // 6. Delete tweet
  await tweet.deleteOne();

  // 7. Return response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
