import { Router } from "express";

import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

// ==============================
// PUBLIC ROUTES
// ==============================

// Get all videos
router.route("/").get(getAllVideos);

// Get single video
router.route("/:videoId").get(getVideoById);

// ==============================
// PROTECTED ROUTES
// ==============================

// Create / publish video
router.route("/").post(
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo,
);

// Update video
router
  .route("/:videoId")
  .patch(verifyJWT, upload.single("thumbnail"), updateVideo);

// Delete video
router.route("/:videoId").delete(verifyJWT, deleteVideo);

// Toggle publish status
router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);

export default router;
