import { useState } from "react";
import { Send, MessageSquare } from "lucide-react";
import { createTweet } from "../api/tweet.api.js";
import { useAuth } from "../hooks/useAuth.js";

function TweetForm({ onTweetCreated }) {
  const { accessToken, user } = useAuth();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Tweet cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await createTweet(
        content.trim(),
        accessToken,
      );

      setContent("");

      if (onTweetCreated) {
        onTweetCreated(response.data);
      }
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to create tweet",
      );
    } finally {
      setLoading(false);
    }
  };

  const charactersLeft = 280 - content.length;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--border-hover)]"
    >
      {/* Header */}

      <div className="mb-4 flex items-center gap-3">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.userName}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-[var(--border)]"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] font-semibold text-[var(--accent)]">
            {user?.userName
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            Share something
          </p>

          <p className="text-xs text-[var(--text-muted)]">
            What's on your mind?
          </p>
        </div>

        <MessageSquare
          size={18}
          className="ml-auto text-[var(--accent)]"
        />
      </div>

      {/* Input */}

      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);

          if (error) {
            setError("");
          }
        }}
        placeholder="What's happening?"
        maxLength={280}
        rows={4}
        disabled={loading}
        className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm leading-6 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 disabled:cursor-not-allowed disabled:opacity-60"
      />

      {/* Footer */}

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`text-xs ${
            charactersLeft <= 20
              ? "font-medium text-[var(--danger)]"
              : "text-[var(--text-muted)]"
          }`}
        >
          {content.length}/280
        </span>

        <button
          type="submit"
          disabled={
            loading || !content.trim()
          }
          className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={15} />

          {loading ? "Posting..." : "Post"}
        </button>
      </div>

      {/* Error */}

      {error && (
        <div className="mt-3 rounded-xl border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </div>
      )}
    </form>
  );
}

export default TweetForm;