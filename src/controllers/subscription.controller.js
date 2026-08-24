import mongoose, { isValidObjectId } from "mongoose";
import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // 1. Get channel ID from URL
  const { channelId } = req.params;

  // 2. Validate channel ID
  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  // 3. Prevent subscribing to yourself
  if (req.user._id.equals(channelId)) {
    throw new ApiError(400, "You cannot subscribe to your own channel");
  }
  // 4. Check if channel exists
  const channel = await User.findById(channelId);

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }
  // 5. Check if user is already subscribed
  const existingSubscription = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });

  // 6. If already subscribed, remove subscription
  if (existingSubscription) {
    await existingSubscription.deleteOne();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { subscribed: false },
          "Channel unsubscribed successfully",
        ),
      );
  }
  // 7. Create subscription
  await Subscription.create({
    subscriber: req.user._id,
    channel: channelId,
  });

  // 8. Return response
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { subscribed: true },
        "Channel subscribed successfully",
      ),
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  // 1. Get channel ID from URL
  const { channelId } = req.params;
  // 2. Validate channel ID
  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  // 3. Check if channel exists
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }
  // 4. Get subscribers of the channel
  const subscribers = await Subscription.find({
    channel: channelId,
  })
    .populate("subscriber", "userName fullName avatar")
    .sort({ createdAt: -1 });
  // 5. Return subscriber list
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribers,
        "Channel subscribers fetched successfully",
      ),
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  // 1. Get subscriber ID from URL
  const { subscriberId } = req.params;
  // 2. Validate subscriber ID
  if (!mongoose.isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");

    // 3. Check if user exists
    const user = await User.findById(subscriberId);
  }
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  // 4. Get channels subscribed to by the user
  const subscriptions = await Subscription.find({
    subscriber: subscriberId,
  })
    .populate("channel", "userName fullName avatar coverImage")
    .sort({ createdAt: -1 });

  // 5. Return subscribed channels
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscriptions,
        "Subscribed channels fetched successfully",
      ),
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
