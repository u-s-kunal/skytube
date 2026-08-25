import { Router } from "express";

import {
  getLikedVideos,
  toggleCommentLike,
  toggleVideoLike,
  toggleTweetLike,
  checkVideoLike,
} from "../controllers/like.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
// None currently — like count is returned with the video.

// Protected routes
router.use(verifyJWT);

router.route("/toggle/v/:videoId").post(toggleVideoLike);

router.route("/toggle/c/:commentId").post(toggleCommentLike);

router.route("/toggle/t/:tweetId").post(toggleTweetLike);

router.route("/videos").get(getLikedVideos);

router.route("/video/:videoId").get(checkVideoLike);

export default router;
