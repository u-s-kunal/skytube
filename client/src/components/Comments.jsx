import { useEffect, useState } from "react";
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} from "../api/comment.api.js";
import { toggleCommentLike } from "../api/like.api.js";
import { useAuth } from "../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Send,
  Edit3,
  Trash2,
  X,
  Check,
  MessageCircle,
} from "lucide-react";

function Comments({ videoId }) {
  const {
    accessToken,
    isAuthenticated,
    user,
  } = useAuth();

  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add comment
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit comment
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Comment likes
  const [commentLikes, setCommentLikes] = useState({});
  const [commentLikeLoading, setCommentLikeLoading] =
    useState({});

  // =========================================================
  // FETCH COMMENTS
  // =========================================================

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getVideoComments(
          videoId,
          accessToken,
        );

        const fetchedComments =
          response.data?.comments || [];

        setComments(fetchedComments);

        const likedState = {};

        fetchedComments.forEach((comment) => {
          likedState[comment._id] =
            comment.isLiked;
        });

        setCommentLikes(likedState);
      } catch (error) {
        console.error(
          "GET COMMENTS ERROR:",
          error,
        );

        setError(
          error.message ||
            "Failed to load comments",
        );
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchComments();
    }
  }, [videoId, isAuthenticated, accessToken]);

  // =========================================================
  // ADD COMMENT
  // =========================================================

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

      const newCommentData = response.data;

      setComments((prev) => [
        newCommentData,
        ...prev,
      ]);

      setCommentLikes((prev) => ({
        ...prev,
        [newCommentData._id]: false,
      }));

      setNewComment("");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // LIKE COMMENT
  // =========================================================

  const handleCommentLike = async (commentId) => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: `/watch/${videoId}`,
        },
      });

      return;
    }

    if (commentLikeLoading[commentId]) {
      return;
    }

    try {
      setCommentLikeLoading((prev) => ({
        ...prev,
        [commentId]: true,
      }));

      const response = await toggleCommentLike(
        commentId,
        accessToken,
      );

      const liked = response.data.liked;

      setCommentLikes((prev) => ({
        ...prev,
        [commentId]: liked,
      }));

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likesCount: liked
                  ? (comment.likesCount ?? 0) + 1
                  : Math.max(
                      (comment.likesCount ?? 0) - 1,
                      0,
                    ),
              }
            : comment,
        ),
      );
    } catch (error) {
      console.error(
        "Failed to like comment:",
        error,
      );
    } finally {
      setCommentLikeLoading((prev) => ({
        ...prev,
        [commentId]: false,
      }));
    }
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  // =========================================================
  // UPDATE COMMENT
  // =========================================================

  const handleUpdate = async (commentId) => {
    if (!editContent.trim()) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await updateComment(
        commentId,
        editContent.trim(),
        accessToken,
      );

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? {
                ...response.data,
                likesCount:
                  comment.likesCount ?? 0,
              }
            : comment,
        ),
      );

      handleCancelEdit();
    } catch (error) {
      console.error(
        "Failed to update comment:",
        error,
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // DELETE COMMENT
  // =========================================================

  const handleDelete = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await deleteComment(
        commentId,
        accessToken,
      );

      setComments((prev) =>
        prev.filter(
          (comment) =>
            comment._id !== commentId,
        ),
      );

      setCommentLikes((prev) => {
        const updated = { ...prev };

        delete updated[commentId];

        return updated;
      });
    } catch (error) {
      console.error(
        "Failed to delete comment:",
        error,
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <section className="mt-10 border-t border-[var(--border)] pt-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <MessageCircle size={18} />
        </div>

        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          Comments
        </h2>

        {!loading && (
          <span className="rounded-full bg-[var(--surface-hover)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)]">
            {comments.length}
          </span>
        )}
      </div>

      {/* =====================================================
          ADD COMMENT
      ===================================================== */}

      <div className="mt-6">
        <form
          onSubmit={handleAddComment}
          className="flex gap-3"
        >
          {/* Avatar */}

          <div className="shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.userName}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-[var(--border)]"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-bold text-[var(--accent)]">
                {user?.userName
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          {/* Input */}

          <div className="min-w-0 flex-1">
            <textarea
              value={newComment}
              onChange={(e) => {
                if (!isAuthenticated) {
                  navigate("/login", {
                    state: {
                      from: `/watch/${videoId}`,
                    },
                  });

                  return;
                }

                setNewComment(e.target.value);
              }}
              placeholder={
                isAuthenticated
                  ? "Share your thoughts..."
                  : "Login to join the conversation"
              }
              disabled={submitting}
              rows={2}
              className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
            />

            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-[var(--text-muted)]">
                {newComment.length > 0
                  ? `${newComment.length} characters`
                  : ""}
              </span>

              <button
                type="submit"
                disabled={
                  !newComment.trim() ||
                  submitting
                }
                className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={14} />

                {submitting
                  ? "Posting..."
                  : "Comment"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="mt-8 space-y-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex animate-pulse gap-3"
            >
              <div className="h-10 w-10 shrink-0 rounded-full bg-[var(--surface-hover)]" />

              <div className="flex-1">
                <div className="h-3 w-24 rounded bg-[var(--surface-hover)]" />

                <div className="mt-3 h-3 w-3/4 rounded bg-[var(--surface-hover)]" />

                <div className="mt-2 h-3 w-1/2 rounded bg-[var(--surface-hover)]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-[var(--danger)]">
          {error}
        </div>
      )}

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {!loading &&
        !error &&
        comments.length === 0 && (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] px-6 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-hover)] text-[var(--text-muted)]">
              <MessageCircle size={22} />
            </div>

            <p className="mt-4 text-sm font-semibold text-[var(--text-primary)]">
              No comments yet
            </p>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Be the first to share your thoughts.
            </p>
          </div>
        )}

      {/* =====================================================
          COMMENTS
      ===================================================== */}

      {!loading && (
        <div className="mt-8 space-y-7">
          {comments.map((comment) => {
            const isOwner =
              user?._id ===
              comment.owner?._id;

            const isCommentLiked =
              commentLikes[comment._id];

            const isLikeLoading =
              commentLikeLoading[
                comment._id
              ];

            return (
              <article
                key={comment._id}
                className="group flex gap-3"
              >
                {/* Avatar */}

                <div className="shrink-0">
                  {comment.owner?.avatar ? (
                    <img
                      src={comment.owner.avatar}
                      alt={
                        comment.owner.userName ||
                        "User"
                      }
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-[var(--border)]"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-bold text-[var(--accent)]">
                      {comment.owner?.userName
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "U"}
                    </div>
                  )}
                </div>

                {/* Content */}

                <div className="min-w-0 flex-1">

                  {/* User info */}

                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {comment.owner?.userName ||
                        "User"}
                    </p>

                    <span className="text-xs text-[var(--text-muted)]">
                      •
                    </span>

                    <span className="text-xs text-[var(--text-muted)]">
                      {comment.createdAt
                        ? new Date(
                            comment.createdAt,
                          ).toLocaleDateString()
                        : ""}
                    </span>
                  </div>

                  {/* =================================================
                      EDIT MODE
                  ================================================= */}

                  {editingId ===
                  comment._id ? (
                    <div className="mt-2">
                      <textarea
                        value={editContent}
                        onChange={(e) =>
                          setEditContent(
                            e.target.value,
                          )
                        }
                        rows={2}
                        autoFocus
                        className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
                      />

                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdate(
                              comment._id,
                            )
                          }
                          disabled={
                            actionLoading ||
                            !editContent.trim()
                          }
                          className="flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-50"
                        >
                          <Check size={14} />

                          {actionLoading
                            ? "Saving..."
                            : "Save"}
                        </button>

                        <button
                          type="button"
                          onClick={
                            handleCancelEdit
                          }
                          disabled={
                            actionLoading
                          }
                          className="flex items-center gap-1.5 rounded-full bg-[var(--surface-hover)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
                        >
                          <X size={14} />

                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Comment text */}

                      <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-[var(--text-secondary)]">
                        {comment.content}
                      </p>

                      {/* Actions */}

                      <div className="mt-2 flex items-center gap-2">

                        {/* Like */}

                        <button
                          type="button"
                          onClick={() =>
                            handleCommentLike(
                              comment._id,
                            )
                          }
                          disabled={
                            isLikeLoading
                          }
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                            isCommentLiked
                              ? "bg-[var(--accent-soft)] text-red-500"
                              : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                          }`}
                        >
                          <Heart
                            size={14}
                            fill={
                              isCommentLiked
                                ? "currentColor"
                                : "none"
                            }
                          />

                          <span>
                            {isLikeLoading
                              ? "..."
                              : comment.likesCount ??
                                0}
                          </span>
                        </button>

                        {/* Edit */}

                        {isOwner && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  comment,
                                )
                              }
                              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                            >
                              <Edit3
                                size={13}
                              />

                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  comment._id,
                                )
                              }
                              disabled={
                                actionLoading
                              }
                              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition hover:bg-red-500/10 hover:text-[var(--danger)] disabled:opacity-50"
                            >
                              <Trash2
                                size={13}
                              />

                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Comments;