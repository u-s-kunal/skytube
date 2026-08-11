import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import upload from "../middleware/multer.middleware.js";
import {
  loginUser,
  logOutUser,
  refreshAccessToken,
  updateAvatar,
  updateCoverImage,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser,
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/update-avatar").post(updateAvatar);
router.route("/update-cover-image").post(updateCoverImage);

export default router;
