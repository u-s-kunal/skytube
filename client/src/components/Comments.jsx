import { useEffect, useState } from "react";
import { getVideoComments } from "../api/comment.api.js";
import {
  addComment,
} from "../api/comment.api.js";
import { useAuth } from "../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";

function Comments({ videoId }) {
const { accessToken, isAuthenticated, user } = useAuth();
const navigate = useNavigate();
const [newComment, setNewComment] = useState("");
const [submitting, setSubmitting] = useState(false);
    
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getVideoComments(videoId);

        console.log("Comments response:", response);

          setComments(response.data?.comments || []);
      } catch (error) {
        console.error(error);
        setError("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchComments();
    }
  }, [videoId]);

    const handleAddComment = async (e) => {
  e.preventDefault();

  if (!isAuthenticated) {
    navigate("/login", {
      state: {
        from: `/watch/${videoId}`,
      },
    });

    return;
  }

  if (!newComment.trim()) {
    return;
  }

  try {
    setSubmitting(true);

    const response = await addComment(
      videoId,
      newComment.trim(),
      accessToken,
    );

    console.log("Comment added:", response);

    const newCommentData = response.data;

    setComments((prev) => [
      newCommentData,
      ...prev,
    ]);

    setNewComment("");
  } catch (error) {
    console.error(error);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <section className="mt-8 border-t pt-6">
      <h2 className="text-xl font-bold">
        Comments
      </h2>

      {loading && (
        <p className="mt-4 text-sm text-gray-500">
          Loading comments...
        </p>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-500">
          {error}
        </p>
      )}

      {!loading && !error && comments.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">
          No comments yet.
        </p>
      )}

      <div className="mt-6 space-y-5">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="flex gap-3"
          >
            {/* Avatar */}
            <img
              src={
                comment.owner?.avatar ||
                "/default-avatar.png"
              }
              alt={
                comment.owner?.userName ||
                "User"
              }
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />

            {/* Comment */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">
                  {comment.owner?.userName || "User"}
                </p>

                <span className="text-xs text-gray-400">
                  {comment.createdAt
                    ? new Date(
                        comment.createdAt,
                      ).toLocaleDateString()
                    : ""}
                </span>
              </div>

              <p className="mt-1 text-sm leading-6 text-gray-700">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
          </div>
          <div className="mt-5">
  <form
    onSubmit={handleAddComment}
    className="flex gap-3"
  >
    {user?.avatar && (
      <img
        src={user.avatar}
        alt={user.userName}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    )}

    <div className="flex-1">
      <textarea
        value={newComment}
        onChange={(e) =>
          setNewComment(e.target.value)
        }
        placeholder={
          isAuthenticated
            ? "Add a comment..."
            : "Login to add a comment"
        }
        disabled={!isAuthenticated || submitting}
        rows={2}
        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
      />

      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={
            !newComment.trim() ||
            submitting
          }
          className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Posting..."
            : "Comment"}
        </button>
      </div>
    </div>
  </form>
</div>
    </section>
  );
}

export default Comments;