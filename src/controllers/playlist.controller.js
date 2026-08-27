import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  // 1. Get playlist details from request body
  const { name, description } = req.body;

  // 2. Validate playlist name
  if (!name?.trim()) {
    throw new ApiError(400, "Playlist name is required");
  }

  // 3. Validate playlist description
  if (!description?.trim()) {
    throw new ApiError(400, "Playlist description is required");
  }

  // 4. Create playlist
  const playlist = await Playlist.create({
    name: name.trim(),
    description: description.trim(),
    video: [],
    owner: req.user._id,
  });

  // 5. Return response
  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  // 1. Get user ID from URL
  const { userId } = req.params;
  // 2. Validate user ID
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  // 3. Find user's playlists
  const playlists = await Playlist.find({
    owner: userId,
  })
    .populate("video")
    .sort({ createdAt: -1 });

  // 4. Return response
  return res
    .status(200)
    .json(
      new ApiResponse(200, playlists, "User playlists fetched successfully"),
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  // 1. Get playlist ID from URL
  const { playlistId } = req.params;
  // 2. Validate playlist ID
  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  // 3. Find playlist and populate videos
  const playlist = await Playlist.findById(playlistId)
    .populate("video")
    .populate("owner", "userName fullName avatar");

  // 5. Return response
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  // 1. Get IDs from URL
  const { playlistId, videoId } = req.params;

  // 2. Validate playlist ID
  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  // 3. Validate video ID
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // 4. Find playlist
  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  // 5. Check playlist ownership
  if (!playlist.owner.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorized to modify this playlist");
  }

  // 6. Check if video exists
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // 7. Check if video already exists in playlist
  if (playlist.video.some((id) => id.equals(videoId))) {
    throw new ApiError(409, "Video already exists in playlist");
  }

  // 8. Add video
  playlist.video.push(videoId);

  // 9. Save playlist
  await playlist.save();

  // 10. Populate videos and owner
  await playlist.populate([
    {
      path: "video",
    },
    {
      path: "owner",
      select: "userName fullName avatar",
    },
  ]);

  // 11. Return updated playlist
  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video added to playlist successfully"),
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  // 1. Get IDs from URL
  const { playlistId, videoId } = req.params;

  // 2. Validate playlist ID
  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  // 3. Validate video ID
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // 4. Find playlist
  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  // 5. Check playlist ownership
  if (!playlist.owner.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorized to modify this playlist");
  }

  // 6. Check if video exists
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // 7. Find video inside playlist
  const videoIndex = playlist.video.findIndex((id) => id.equals(videoId));

  if (videoIndex === -1) {
    throw new ApiError(404, "Video is not in this playlist");
  }

  // 8. Remove video
  playlist.video.splice(videoIndex, 1);

  // 9. Save playlist
  await playlist.save();

  // 10. Populate videos and owner
  await playlist.populate([
    {
      path: "video",
    },
    {
      path: "owner",
      select: "userName fullName avatar",
    },
  ]);

  // 11. Return updated playlist
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playlist,
        "Video removed from playlist successfully",
      ),
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  // 2. Validate playlist ID
  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }
  // 3. Find playlist
  const playlist = await Playlist.findById(playlistId);

  // 4. Check if playlist exists
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  // 5. Check if logged-in user owns the playlist
  if (!playlist.owner.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorized to delete this playlist");
  }
  // 6. Delete playlist
  await playlist.deleteOne();
  // 7. Return response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  // 1. Get playlist ID from URL
  const { playlistId } = req.params;
  // 2. Get updated details from request body
  const { name, description } = req.body;

  // 3. Validate playlist ID
  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }
  // 4. Find playlist
  const playlist = await Playlist.findById(playlistId);

  // 5. Check if playlist exists
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  // 6. Check if logged-in user owns the playlist
  if (!playlist.owner.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorized to update this playlist");
  }
  // 7. Validate name
  if (!name?.trim()) {
    throw new ApiError(400, "Playlist name is required");
  }

  // 8. Validate description
  if (!description?.trim()) {
    throw new ApiError(400, "Playlist description is required");
  }
  // 9. Update playlist
  playlist.name = name.trim();
  playlist.description = description.trim();

  // 10. Save changes
  await playlist.save();

  // 11. Return updated playlist
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
