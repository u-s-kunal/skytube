import { Router } from "express";

import {
  checkSubscription,
  getSubscribedChannels,
  getSubscriberCount,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// Subscribe / unsubscribe
router.post("/c/:channelId", toggleSubscription);

// Check subscription status
router.get("/c/:channelId/status", checkSubscription);

// Get subscriber count
router.get("/c/:channelId/count", getSubscriberCount);

// Get subscribers of a channel
router.get("/c/:channelId/subscribers", getUserChannelSubscribers);

// Get channels subscribed to by a user
router.get("/u/:subscriberId/channels", getSubscribedChannels);

export default router;
