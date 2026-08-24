import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import Subscription from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  // 1. Get logged-in user's ID
  const ownerId = req.user._id;
  // 2. Get video statistics
  const videoStats = await Video.aggregate([
    {
      $match: {
        owner: ownerId,
        isPublished: true,
      },
    },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
      },
    },
  ]);

  // 3. Handle channel with no videos
  const stats = videoStats[0] || {
    totalVideos: 0,
    totalViews: 0,
  };

  // 4. Get total likes on channel videos
  const likeStats = await Like.aggregate([
    {
      $match: {
        video: { $ne: null },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
      },
    },
    {
      $unwind: "$video",
    },
    {
      $match: {
        "video.owner": ownerId,
        "video.isPublished": true,
      },
    },
    {
      $count: "totalLikes",
    },
  ]);

  // 5. Handle channel with no likes
  const totalLikes = likeStats[0]?.totalLikes || 0;
  // 6. Send response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos: stats.totalVideos,
        totalViews: stats.totalViews,
        totalLikes,
        totalSubscribers: 0, // temporary
      },
      "Channel statistics fetched successfully",
    ),
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // 1. Get logged-in user's ID
  const ownerId = req.user._id;

  // 2. Get all videos uploaded by the channel
  const videos = await Video.find({
    owner: ownerId,
  }).sort({ createdAt: -1 });

  // 3. Return response
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
