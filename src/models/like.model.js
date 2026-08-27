import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },

    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },

    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },

    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate video likes
likeSchema.index(
  { video: 1, likedBy: 1 },
  {
    unique: true,
    partialFilterExpression: {
      video: { $exists: true },
    },
  },
);

// Prevent duplicate comment likes
likeSchema.index(
  { comment: 1, likedBy: 1 },
  {
    unique: true,
    partialFilterExpression: {
      comment: { $exists: true },
    },
  },
);

// Prevent duplicate tweet likes
likeSchema.index(
  { tweet: 1, likedBy: 1 },
  {
    unique: true,
    partialFilterExpression: {
      tweet: { $exists: true },
    },
  },
);

export const Like = mongoose.model("Like", likeSchema);
