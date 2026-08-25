import { Router } from "express";

import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Public: anyone can read comments
router.route("/:videoId").get(getVideoComments);

// Protected: login required
router.route("/:videoId").post(verifyJWT, addComment);

router
  .route("/c/:commentId")
  .delete(verifyJWT, deleteComment)
  .patch(verifyJWT, updateComment);

export default router;
