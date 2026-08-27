import { useEffect, useRef, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Heart,
  ListPlus,
  ListVideo,
  Check,
  LoaderCircle,
  X,
  Plus,
  Eye,
  CalendarDays,
  Play,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

import SubscribeButton from "../components/SubscribeButton.jsx";
import Comments from "../components/Comments.jsx";

import { getVideoById } from "../api/video.api.js";

import {
  toggleVideoLike,
  checkVideoLike,
} from "../api/like.api.js";

import { useAuth } from "../hooks/useAuth.js";

import {
  getUserPlaylists,
  addVideoToPlaylist,
} from "../api/playlist.api.js";

function Watch() {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const hasFetchedVideo = useRef(false);

  // =========================================================
  // AUTH
  // =========================================================

  const {
    accessToken,
    isAuthenticated,
    user,
  } = useAuth();

  // =========================================================
  // VIDEO
  // =========================================================

  const [video, setVideo] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // LIKE
  // =========================================================

  const [isLiked, setIsLiked] =
    useState(false);

  const [likeLoading, setLikeLoading] =
    useState(false);

  // =========================================================
  // PLAYLIST
  // =========================================================

  const [playlists, setPlaylists] =
    useState([]);

  const [showPlaylists, setShowPlaylists] =
    useState(false);

  const [playlistLoading, setPlaylistLoading] =
    useState(false);

  const [addingToPlaylist, setAddingToPlaylist] =
    useState(null);

  // =========================================================
  // FETCH VIDEO
  // =========================================================

  useEffect(() => {
    if (hasFetchedVideo.current) {
      return;
    }

    hasFetchedVideo.current = true;

    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getVideoById(videoId);

        setVideo(response.data);
      } catch (error) {
        console.error(error);

        setError(
          error.message ||
            "Failed to load video",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  // =========================================================
  // CHECK LIKE STATUS
  // =========================================================

  useEffect(() => {
    const checkLike = async () => {
      if (
        !isAuthenticated ||
        !accessToken
      ) {
        setIsLiked(false);
        return;
      }

      try {
        const response =
          await checkVideoLike(
            videoId,
            accessToken,
          );

        setIsLiked(
          response.data?.liked ?? false,
        );
      } catch (error) {
        console.error(
          "Failed to check like status:",
          error,
        );
      }
    };

    checkLike();
  }, [
    videoId,
    accessToken,
    isAuthenticated,
  ]);

  // =========================================================
  // LIKE / UNLIKE
  // =========================================================

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: `/watch/${videoId}`,
        },
      });

      return;
    }

    try {
      setLikeLoading(true);

      const response =
        await toggleVideoLike(
          videoId,
          accessToken,
        );

      const liked =
        response.data?.liked ?? false;

      setIsLiked(liked);

      setVideo((prev) => ({
        ...prev,
        likesCount: liked
          ? (prev.likesCount ?? 0) + 1
          : Math.max(
              (prev.likesCount ?? 0) - 1,
              0,
            ),
      }));
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to update like",
      );
    } finally {
      setLikeLoading(false);
    }
  };

  // =========================================================
  // SHOW PLAYLISTS
  // =========================================================

  const handleShowPlaylists = async () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: `/watch/${videoId}`,
        },
      });

      return;
    }

    if (showPlaylists) {
      setShowPlaylists(false);
      return;
    }

    try {
      setPlaylistLoading(true);

      const response =
        await getUserPlaylists(
          user._id,
          accessToken,
        );

      setPlaylists(
        response.data || [],
      );

      setShowPlaylists(true);
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to load playlists",
      );
    } finally {
      setPlaylistLoading(false);
    }
  };

  // =========================================================
  // ADD TO PLAYLIST
  // =========================================================

  const handleAddToPlaylist = async (
    playlistId,
  ) => {
    try {
      setAddingToPlaylist(playlistId);

      await addVideoToPlaylist(
        videoId,
        playlistId,
        accessToken,
      );

      setShowPlaylists(false);
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to add video to playlist",
      );
    } finally {
      setAddingToPlaylist(null);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <LoaderCircle
              size={26}
              className="animate-spin"
            />
          </div>

          <p className="mt-4 text-sm font-medium text-[var(--text-secondary)]">
            Loading video...
          </p>

        </div>
      </main>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error && !video) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--danger)]/10 text-[var(--danger)]">
            <AlertCircle size={26} />
          </div>

          <h1 className="mt-5 text-lg font-semibold text-[var(--text-primary)]">
            Unable to load video
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            {error}
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

        </div>
      </main>
    );
  }

  // =========================================================
  // VIDEO NOT FOUND
  // =========================================================

  if (!video) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-hover)] text-[var(--text-muted)]">
            <Play size={25} />
          </div>

          <h1 className="mt-4 font-semibold text-[var(--text-primary)]">
            Video not found
          </h1>

          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>

        </div>
      </main>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">

      {/* =====================================================
          VIDEO PLAYER
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-black shadow-xl">
        <video
          className="aspect-video w-full"
          controls
          autoPlay
          poster={video.thumbnail}
        >
          <source
            src={video.videoFile}
            type="video/mp4"
          />

          Your browser does not support
          the video tag.
        </video>
      </div>

      {/* =====================================================
          VIDEO TITLE
      ===================================================== */}

      <section className="mt-6">

        <h1 className="text-xl font-bold leading-7 tracking-tight text-[var(--text-primary)] sm:text-2xl">
          {video.title}
        </h1>

        {/* ===================================================
            METADATA + ACTIONS
        =================================================== */}

        <div className="mt-4 flex flex-col gap-4 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-center sm:justify-between">

          {/* Metadata */}

          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">

            <span className="flex items-center gap-1.5">
              <Eye size={15} />

              {video.views ?? 0} views
            </span>

            <span className="h-1 w-1 rounded-full bg-[var(--text-muted)]" />

            <span className="flex items-center gap-1.5">
              <CalendarDays size={15} />

              {new Date(
                video.createdAt,
              ).toLocaleDateString(
                undefined,
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                },
              )}
            </span>

          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="relative flex flex-wrap items-center gap-2">

            {/* LIKE */}

            <button
              type="button"
              onClick={handleLike}
              disabled={likeLoading}
              className={`group flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition duration-200 ${
                isLiked
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-red-500"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {likeLoading ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Heart
                  size={18}
                  fill={
                    isLiked
                      ? "currentColor"
                      : "none"
                  }
                  className="transition-transform duration-200 group-hover:scale-110"
                />
              )}

              <span>
                {video.likesCount ?? 0}
              </span>
            </button>

            {/* PLAYLIST */}

            <button
              type="button"
              onClick={
                handleShowPlaylists
              }
              disabled={playlistLoading}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition duration-200 ${
                showPlaylists
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {playlistLoading ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <ListPlus size={18} />
              )}

              <span className="hidden sm:inline">
                Playlist
              </span>
            </button>

            {/* =================================================
                PLAYLIST DROPDOWN
            ================================================= */}

            {showPlaylists && (
              <div className="absolute right-0 top-full z-30 mt-3 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">

                {/* Header */}

                <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">

                  <div>
                    <div className="flex items-center gap-2">

                      <ListVideo
                        size={17}
                        className="text-[var(--accent)]"
                      />

                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        Add to playlist
                      </p>

                    </div>

                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Save this video for
                      later
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowPlaylists(
                        false,
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                    aria-label="Close playlist menu"
                  >
                    <X size={16} />
                  </button>

                </div>

                {/* Playlist list */}

                {playlists.length === 0 ? (
                  <div className="px-5 py-8 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                      <ListVideo size={21} />
                    </div>

                    <p className="mt-3 text-sm font-medium text-[var(--text-primary)]">
                      No playlists yet
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                      Create a playlist to
                      save this video.
                    </p>

                    <Link
                      to="/playlists"
                      onClick={() =>
                        setShowPlaylists(
                          false,
                        )
                      }
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--accent-hover)]"
                    >
                      <Plus size={14} />
                      Create playlist
                    </Link>

                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto p-2">

                    {playlists.map(
                      (playlist) => {
                        const isAdding =
                          addingToPlaylist ===
                          playlist._id;

                        return (
                          <button
                            key={
                              playlist._id
                            }
                            type="button"
                            onClick={() =>
                              handleAddToPlaylist(
                                playlist._id,
                              )
                            }
                            disabled={
                              isAdding
                            }
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                          >

                            {/* Playlist icon */}

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                              {isAdding ? (
                                <LoaderCircle
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <ListVideo
                                  size={16}
                                />
                              )}
                            </div>

                            {/* Playlist info */}

                            <div className="min-w-0 flex-1">

                              <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                                {
                                  playlist.name
                                }
                              </p>

                              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                                {playlist
                                  .video
                                  ?.length ||
                                  0}{" "}
                                {playlist
                                  .video
                                  ?.length ===
                                1
                                  ? "video"
                                  : "videos"}
                              </p>

                            </div>

                            {/* Status */}

                            {isAdding ? (
                              <span className="text-xs font-medium text-[var(--accent)]">
                                Adding
                              </span>
                            ) : (
                              <Check
                                size={16}
                                className="text-[var(--text-muted)]"
                              />
                            )}

                          </button>
                        );
                      },
                    )}

                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      </section>

      {/* =====================================================
          CHANNEL
      ===================================================== */}

      <section className="mt-5 flex flex-col gap-4 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-center">

        {/* Channel information */}

        <div className="flex min-w-0 flex-1 items-center gap-3">

          {video.owner?.avatar ? (
            <img
              src={video.owner.avatar}
              alt={
                video.owner.userName ||
                "Channel"
              }
              className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-[var(--border)]"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] font-semibold text-[var(--accent)]">
              {video.owner?.userName
                ?.charAt(0)
                ?.toUpperCase() || "C"}
            </div>
          )}

          <div className="min-w-0">

            {video.owner?.userName ? (
              <Link
                to={`/channel/${video.owner.userName}`}
                className="block truncate font-semibold text-[var(--text-primary)] transition hover:text-[var(--accent)]"
              >
                {video.owner.userName}
              </Link>
            ) : (
              <p className="font-semibold text-[var(--text-primary)]">
                Channel
              </p>
            )}

            <p className="mt-0.5 text-sm text-[var(--text-muted)]">
              Video creator
            </p>

          </div>
        </div>

        {/* Subscribe */}

        {user?._id?.toString() !==
          video.owner?._id?.toString() && (
          <SubscribeButton
            channelId={
              video.owner?._id
            }
          />
        )}

      </section>

      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <section className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />

          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Description
          </h2>
        </div>

        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--text-secondary)]">
          {video.description}
        </p>

      </section>

      {/* =====================================================
          INLINE ERROR
      ===================================================== */}

      {error && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-4 py-3">

          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0 text-[var(--danger)]"
          />

          <p className="text-sm text-[var(--danger)]">
            {error}
          </p>

        </div>
      )}

      {/* =====================================================
          COMMENTS
      ===================================================== */}

      <section className="mt-8">
        <Comments videoId={videoId} />
      </section>

    </main>
  );
}

export default Watch;