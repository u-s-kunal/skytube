import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  // 1. Get video ID from URL
  const { videoId } = req.params;

  // 2. Validate video ID
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // 3. Check if video exists
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // 4. Check if user already liked the video
  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  // 5. If already liked, remove the like
  if (existingLike) {
    await existingLike.deleteOne();

    return res
      .status(200)
      .json(
        new ApiResponse(200, { liked: false }, "Video unliked successfully"),
      );
  }

  // 6. If not liked, create a like
  await Like.create({
    video: videoId,
    likedBy: req.user._id,
  });

  // 7. Return response
  return res
    .status(201)
    .json(new ApiResponse(201, { liked: true }, "Video liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  // 1. Get comment ID from URL
  const { commentId } = req.params;

  // 2. Validate comment ID
  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  // 3. Check if comment exists
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // 4. Check if user already liked the comment
  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  // 5. If already liked, remove the like
  if (existingLike) {
    await existingLike.deleteOne();

    return res
      .status(200)
      .json(
        new ApiResponse(200, { liked: false }, "Comment unliked successfully"),
      );
  }

  // 6. If not liked, create a like
  await Like.create({
    comment: commentId,
    likedBy: req.user._id,
  });

  // 7. Return response
  return res
    .status(201)
    .json(new ApiResponse(201, { liked: true }, "Comment liked successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  // 1. Get tweet ID from URL
  const { tweetId } = req.params;
  // 2. Validate tweet ID
  if (!mongoose.isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  // 3. Check if tweet exists
  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }
  // 4. Check if user already liked the tweet
  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  // 5. If already liked, remove the like
  if (existingLike) {
    await existingLike.deleteOne();

    return res
      .status(200)
      .json(
        new ApiResponse(200, { liked: false }, "Tweet unliked successfully"),
      );
  }
  // 6. If not liked, create a like
  await Like.create({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  // 7. Check video Like

  const checkVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video ID");
    }

    const existingLike = await Like.findOne({
      video: videoId,
      likedBy: req.user._id,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          liked: !!existingLike,
        },
        "Video like status fetched successfully",
      ),
    );
  });

  // 8. Return response
  return res
    .status(201)
    .json(new ApiResponse(201, { liked: true }, "Tweet liked successfully"));
});

const checkVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        liked: !!existingLike,
      },
      "Video like status fetched successfully",
    ),
  );
});

const getLikedVideos = asyncHandler(async (req, res) => {
  // 1. Get logged-in user's ID
  const userId = req.user._id;

  // 2. Get videos liked by the user
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: userId,
        video: { $ne: null },
      },
    },
    // 3. Get the actual video document
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
      },
    },
    // 4. Convert video array into an object
    {
      $unwind: "$video",
    },
    // 5. Return useful video information
    {
      $replaceRoot: {
        newRoot: "$video",
      },
    },
    // 6. Newest liked videos first
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);
  // 7. Return response
  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully"),
    );
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
  checkVideoLike,
};
