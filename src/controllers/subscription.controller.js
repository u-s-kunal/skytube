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
  const { subscriberId } = req.params;

  if (!mongoose.isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  const user = await User.findById(subscriberId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const subscriptions = await Subscription.find({
    subscriber: subscriberId,
  })
    .populate("channel", "userName fullName avatar coverImage")
    .sort({ createdAt: -1 });

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

// Check whether the logged-in user subscribed to a channel
const checkSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // Validate channel ID
  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  // Check if channel exists
  const channel = await User.findById(channelId);

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  // Check subscription
  const existingSubscription = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subscribed: !!existingSubscription,
      },
      "Subscription status fetched successfully",
    ),
  );
});

// Get subscriber count of a channel
const getSubscriberCount = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // Validate channel ID
  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  // Check if channel exists
  const channel = await User.findById(channelId);

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  // Count subscribers
  const subscribersCount = await Subscription.countDocuments({
    channel: channelId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subscribersCount,
      },
      "Subscriber count fetched successfully",
    ),
  );
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
  checkSubscription,
  getSubscriberCount,
};
