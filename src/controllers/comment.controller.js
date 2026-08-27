import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";

/////////GET COMMENT LOGIC FROM HERE ///////

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (
    !Number.isInteger(pageNumber) ||
    !Number.isInteger(limitNumber) ||
    pageNumber < 1 ||
    limitNumber < 1
  ) {
    throw new ApiError(400, "Page and limit must be positive integers");
  }

  if (limitNumber > 100) {
    throw new ApiError(400, "Limit cannot exceed 100");
  }

  const skip = (pageNumber - 1) * limitNumber;

  // Get comments
  const comments = await Comment.find({
    video: videoId,
  })
    .populate("owner", "userName fullName avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber)
    .lean();

  const commentIds = comments.map((comment) => comment._id);

  // Get like counts
  let likeCounts = [];

  if (commentIds.length > 0) {
    likeCounts = await Like.aggregate([
      {
        $match: {
          comment: {
            $in: commentIds,
          },
        },
      },
      {
        $group: {
          _id: "$comment",
          count: {
            $sum: 1,
          },
        },
      },
    ]);
  }

  const likeCountMap = new Map(
    likeCounts.map((item) => [item._id.toString(), item.count]),
  );

  // Get comments liked by current user
  let likedCommentIds = new Set();

  if (req.user && commentIds.length > 0) {
    const likedComments = await Like.find({
      comment: {
        $in: commentIds,
      },
      likedBy: req.user._id,
    }).select("comment");

    likedCommentIds = new Set(
      likedComments.map((like) => like.comment.toString()),
    );
  }

  // Add like information to comments
  comments.forEach((comment) => {
    const commentId = comment._id.toString();

    comment.likesCount = likeCountMap.get(commentId) || 0;

    comment.isLiked = likedCommentIds.has(commentId);
  });

  // Get total comments
  const totalComments = await Comment.countDocuments({
    video: videoId,
  });

  const totalPages = Math.ceil(totalComments / limitNumber);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments,
        page: pageNumber,
        limit: limitNumber,
        totalComments,
        totalPages,
      },
      "Comments fetched successfully",
    ),
  );
});

/////////ADD COMMENT LOGIC FROM HERE ///////

const addComment = asyncHandler(async (req, res) => {
  // 1. Get video ID from URL
  const { videoId } = req.params;

  // 2. Get comment content from request body
  const { content } = req.body;

  // 3. Validate video ID
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // 4. Validate comment content
  if (!content?.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  // 5. Create comment
  const comment = await Comment.create({
    content: content.trim(),
    video: videoId,
    owner: req.user._id,
  });

  // 6. Get safe owner information
  await comment.populate("owner", "userName fullName avatar");

  // 7. Return response
  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

/////////UPDATE COMMENT LOGIC FROM HERE ///////

const updateComment = asyncHandler(async (req, res) => {
  // 1. Get comment ID from URL
  const { commentId } = req.params;

  // 2. Get new content from request body
  const { content } = req.body;

  // 3. Validate comment ID
  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  // 4. Validate content
  if (!content?.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  // 5. Find the comment
  const comment = await Comment.findById(commentId);

  // 6. Check if comment exists
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // 7. Check if logged-in user owns the comment
  if (!comment.owner.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorized to update this comment");
  }

  // 8. Update content
  comment.content = content.trim();

  // 9. Save changes
  await comment.save();

  // 10. Populate safe owner information
  await comment.populate("owner", "userName fullName avatar");

  // 11. Return updated comment
  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

/////////DETELE COMMENTS LOGIC FROM HERE ///////

const deleteComment = asyncHandler(async (req, res) => {
  // 1. Get comment ID from URL
  const { commentId } = req.params;

  // 2. Validate comment ID
  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  // 3. Find the comment
  const comment = await Comment.findById(commentId);

  // 4. Check if comment exists
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // 5. Check if logged-in user owns the comment
  if (!comment.owner.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  // 6. Delete the comment
  await comment.deleteOne();

  // 7. Return response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
