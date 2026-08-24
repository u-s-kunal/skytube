import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  // 1. Get query parameters
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  // 2. Convert pagination values to numbers
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  // 3. Validate pagination
  if (
    !Number.isInteger(pageNumber) ||
    !Number.isInteger(limitNumber) ||
    pageNumber < 1 ||
    limitNumber < 1
  ) {
    throw new ApiError(400, "Page and limit must be positive integers");
  }

  // 4. Build match conditions
  const matchConditions = {
    isPublished: true,
  };

  // 5. Search videos by title or description
  if (query?.trim()) {
    matchConditions.$or = [
      {
        title: {
          $regex: query.trim(),
          $options: "i",
        },
      },
      {
        description: {
          $regex: query.trim(),
          $options: "i",
        },
      },
    ];
  }
  // 6. Filter videos by user
  if (userId) {
    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user ID");
    }

    matchConditions.owner = new mongoose.Types.ObjectId(userId);
  }
  // 7. Determine sort direction
  const sortDirection = sortType.toLowerCase() === "asc" ? 1 : -1;

  // 8. Build aggregation pipeline
  const pipeline = [
    {
      $match: matchConditions,
    },

    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },

    {
      $unwind: "$owner",
    },

    {
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        createdAt: 1,

        owner: {
          _id: "$owner._id",
          userName: "$owner.userName",
          fullName: "$owner.fullName",
          avatar: "$owner.avatar",
        },
      },
    },

    {
      $sort: {
        [sortBy]: sortDirection,
      },
    },
  ];
  // 9. Paginate results
  const aggregate = Video.aggregate(pipeline);

  const videos = await Video.aggregatePaginate(aggregate, {
    page: pageNumber,
    limit: limitNumber,
  });

  // 10. Return response
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  // 1. Get video details from request body
  const { title, description } = req.body;

  // 2. Validate title
  if (!title?.trim()) {
    throw new ApiError(400, "Video title is required");
  }

  // 3. Validate description
  if (!description?.trim()) {
    throw new ApiError(400, "Video description is required");
  }

  // 4. Get uploaded files
  const videoFile = req.files?.videoFile?.[0];
  const thumbnail = req.files?.thumbnail?.[0];

  // 5. Validate video file
  if (!videoFile) {
    throw new ApiError(400, "Video file is required");
  }

  // 6. Validate thumbnail
  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail is required");
  }

  // 7. Upload video to Cloudinary
  const videoUpload = await uploadOnCloudinary(videoFile.path);

  if (!videoUpload) {
    throw new ApiError(500, "Video upload failed");
  }

  // 8. Upload thumbnail to Cloudinary
  const thumbnailUpload = await uploadOnCloudinary(thumbnail.path);

  if (!thumbnailUpload) {
    throw new ApiError(500, "Thumbnail upload failed");
  }

  // 9. Create video in database
  const video = await Video.create({
    videoFile: videoUpload.secure_url,
    thumbnail: thumbnailUpload.secure_url,
    title: title.trim(),
    description: description.trim(),
    duration: videoUpload.duration || 0,
    owner: req.user._id,
  });

  // 10. Return response
  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  // 1. Get video ID from URL
  const { videoId } = req.params;

  // 2. Validate video ID
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // 3. Find video
  const video = await Video.findById(videoId).populate(
    "owner",
    "userName fullName avatar",
  );

  // 4. Check if video exists
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // 5. Return video
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  // 1. Get video ID from URL
  const { videoId } = req.params;

  // 2. Get updated details from request body
  const { title, description } = req.body;

  // 3. Validate video ID
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // 4. Find video
  const video = await Video.findById(videoId);

  // 5. Check if video exists
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // 6. Check ownership
  if (!video.owner.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorized to update this video");
  }

  // 7. Update title if provided
  if (title !== undefined) {
    if (!title.trim()) {
      throw new ApiError(400, "Video title cannot be empty");
    }

    video.title = title.trim();
  }

  // 8. Update description if provided
  if (description !== undefined) {
    if (!description.trim()) {
      throw new ApiError(400, "Video description cannot be empty");
    }

    video.description = description.trim();
  }

  // 9. Check if a new thumbnail was uploaded
  if (req.file) {
    const thumbnailUpload = await uploadOnCloudinary(req.file.path);

    if (!thumbnailUpload) {
      throw new ApiError(500, "Thumbnail upload failed");
    }

    video.thumbnail = thumbnailUpload.secure_url;
  }

  // 10. Save changes
  await video.save();

  // 11. Populate safe owner information
  await video.populate("owner", "userName fullName avatar");

  // 12. Return updated video
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  // 1. Get video ID from URL
  const { videoId } = req.params;

  // 2. Validate video ID
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // 3. Find video
  const video = await Video.findById(videoId);

  // 4. Check if video exists
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // 5. Check if logged-in user owns the video
  if (!video.owner.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }

  // 6. Delete video
  await video.deleteOne();

  // 7. Return response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  // 1. Get video ID from URL
  const { videoId } = req.params;

  // 2. Validate video ID
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // 3. Find video
  const video = await Video.findById(videoId);

  // 4. Check if video exists
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // 5. Check if logged-in user owns the video
  if (!video.owner.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorized to change this video");
  }

  // 6. Toggle publish status
  video.isPublished = !video.isPublished;

  // 7. Save changes
  await video.save();

  // 8. Return updated status
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videoId: video._id,
        isPublished: video.isPublished,
      },
      video.isPublished
        ? "Video published successfully"
        : "Video unpublished successfully",
    ),
  );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
