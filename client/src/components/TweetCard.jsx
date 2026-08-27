import { useState } from "react";
import {
  Edit3,
  Trash2,
  Save,
  X,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import {
  deleteTweet,
  updateTweet,
} from "../api/tweet.api.js";

function TweetCard({
  tweet,
  onTweetUpdated,
  onTweetDeleted,
}) {
  const { user, accessToken } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(
    tweet.content,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isOwner =
    user?._id?.toString() ===
    tweet.owner?._id?.toString();

  const formattedDate = new Date(
    tweet.createdAt,
  ).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Tweet cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await updateTweet(
        tweet._id,
        content.trim(),
        accessToken,
      );

      setIsEditing(false);

      if (onTweetUpdated) {
        onTweetUpdated(response.data);
      }
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to update tweet",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this tweet?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");

      await deleteTweet(
        tweet._id,
        accessToken,
      );

      if (onTweetDeleted) {
        onTweetDeleted(tweet._id);
      }
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to delete tweet",
      );

      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setContent(tweet.content);
    setError("");
    setIsEditing(false);
  };

  return (
    <article
      className="
        group
        rounded-2xl
        border
        border-[var(--border)]
        bg-[var(--surface)]
        p-5
        transition
        duration-200
        hover:border-[var(--border-hover)]
        hover:shadow-sm
      "
    >
      {/* Header */}

      <div className="flex items-start gap-3">
        {/* Avatar */}

        {tweet.owner?.avatar ? (
          <img
            src={tweet.owner.avatar}
            alt={
              tweet.owner?.userName ||
              "User"
            }
            className="
              h-11
              w-11
              shrink-0
              rounded-full
              object-cover
              ring-1
              ring-[var(--border)]
            "
          />
        ) : (
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[var(--accent-soft)]
              font-semibold
              text-[var(--accent)]
            "
          >
            {tweet.owner?.userName
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </div>
        )}

        {/* User */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2">
            <h3 className="truncate font-semibold text-[var(--text-primary)]">
              {tweet.owner?.fullName ||
                tweet.owner?.userName ||
                "User"}
            </h3>

            {tweet.owner?.userName && (
              <span className="truncate text-sm text-[var(--text-muted)]">
                @{tweet.owner.userName}
              </span>
            )}
          </div>

          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
            {formattedDate}
          </p>
        </div>

        {/* Tweet icon */}

        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[var(--accent-soft)]
            text-[var(--accent)]
            opacity-70
            transition
            group-hover:opacity-100
          "
        >
          <MessageSquare size={15} />
        </div>
      </div>

      {/* Content */}

      {isEditing ? (
        <form
          onSubmit={handleUpdate}
          className="mt-5"
        >
          <textarea
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            maxLength={280}
            rows={4}
            autoFocus
            className="
              w-full
              resize-none
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--background)]
              p-4
              text-sm
              leading-6
              text-[var(--text-primary)]
              outline-none
              transition
              placeholder:text-[var(--text-muted)]
              focus:border-[var(--accent)]
              focus:ring-2
              focus:ring-[var(--accent)]/10
            "
          />

          <div className="mt-3 flex items-center justify-between">
            <span
              className={`text-xs ${
                content.length >= 260
                  ? "font-medium text-[var(--danger)]"
                  : "text-[var(--text-muted)]"
              }`}
            >
              {content.length}/280
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={loading}
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-[var(--text-secondary)]
                  transition
                  hover:bg-[var(--surface-hover)]
                  hover:text-[var(--text-primary)]
                  disabled:opacity-50
                "
              >
                <X size={15} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  loading ||
                  !content.trim()
                }
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-[var(--accent)]
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[var(--accent-hover)]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <Save size={15} />

                {loading
                  ? "Saving..."
                  : "Save"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <p
          className="
            mt-5
            whitespace-pre-wrap
            break-words
            text-[15px]
            leading-7
            text-[var(--text-primary)]
          "
        >
          {tweet.content}
        </p>
      )}

      {/* Error */}

      {error && (
        <div
          className="
            mt-4
            rounded-xl
            border
            border-[var(--danger)]/20
            bg-[var(--danger)]/10
            px-3
            py-2
            text-sm
            text-[var(--danger)]
          "
        >
          {error}
        </div>
      )}

      {/* Owner actions */}

      {isOwner && !isEditing && (
        <div
          className="
            mt-5
            flex
            gap-2
            border-t
            border-[var(--border)]
            pt-4
          "
        >
          <button
            type="button"
            onClick={() => {
              setContent(tweet.content);
              setError("");
              setIsEditing(true);
            }}
            disabled={loading}
            className="
              flex
              items-center
              gap-1.5
              rounded-full
              px-3
              py-1.5
              text-xs
              font-medium
              text-[var(--text-secondary)]
              transition
              hover:bg-[var(--surface-hover)]
              hover:text-[var(--text-primary)]
              disabled:opacity-50
            "
          >
            <Edit3 size={14} />
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="
              flex
              items-center
              gap-1.5
              rounded-full
              px-3
              py-1.5
              text-xs
              font-medium
              text-[var(--text-secondary)]
              transition
              hover:bg-[var(--danger)]/10
              hover:text-[var(--danger)]
              disabled:opacity-50
            "
          >
            <Trash2 size={14} />

            {loading
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      )}
    </article>
  );
}

export default TweetCard;