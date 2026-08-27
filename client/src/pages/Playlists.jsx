import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FolderOpen,
  Plus,
  X,
  Trash2,
  Play,
  ListVideo,
  LogIn,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth.js";
import {
  getUserPlaylists,
  createPlaylist,
  deletePlaylist,
} from "../api/playlist.api.js";

function Playlists() {
  const {
    user,
    accessToken,
    isAuthenticated,
  } = useAuth();

  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreate, setShowCreate] =
    useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [creating, setCreating] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  // =========================================================
  // FETCH PLAYLISTS
  // =========================================================

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (
        !isAuthenticated ||
        !user?._id ||
        !accessToken
      ) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getUserPlaylists(
            user._id,
            accessToken,
          );

        setPlaylists(response.data || []);
      } catch (error) {
        console.error(error);

        setError(
          error.message ||
            "Failed to load playlists",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [
    user,
    accessToken,
    isAuthenticated,
  ]);

  // =========================================================
  // CREATE PLAYLIST
  // =========================================================

  const handleCreatePlaylist = async (
    e,
  ) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !description.trim()
    ) {
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response =
        await createPlaylist(
          name.trim(),
          description.trim(),
          accessToken,
        );

      setPlaylists((prev) => [
        response.data,
        ...prev,
      ]);

      setName("");
      setDescription("");
      setShowCreate(false);
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to create playlist",
      );
    } finally {
      setCreating(false);
    }
  };

  // =========================================================
  // DELETE PLAYLIST
  // =========================================================

  const handleDeletePlaylist = async (
    playlistId,
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this playlist?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(playlistId);
      setError("");

      await deletePlaylist(
        playlistId,
        accessToken,
      );

      setPlaylists((prev) =>
        prev.filter(
          (playlist) =>
            playlist._id !== playlistId,
        ),
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to delete playlist",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // NOT AUTHENTICATED
  // =========================================================

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <FolderOpen size={25} />
          </div>

          <h1 className="mt-5 text-xl font-bold text-[var(--text-primary)]">
            Login to view your playlists
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Sign in to create and manage
            your video collections.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] active:scale-95"
          >
            <LogIn size={16} />
            Login
          </button>
        </div>
      </main>
    );
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-[var(--surface-hover)]" />

        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-[var(--surface-hover)]" />

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
            >
              <div className="aspect-video animate-pulse bg-[var(--surface-hover)]" />

              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-[var(--surface-hover)]" />

                <div className="h-4 w-full animate-pulse rounded bg-[var(--surface-hover)]" />

                <div className="h-4 w-1/3 animate-pulse rounded bg-[var(--surface-hover)]" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <FolderOpen size={21} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Your Playlists
            </h1>

            <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
              Organize your favorite videos.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowCreate((prev) => !prev)
          }
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] active:scale-95"
        >
          {showCreate ? (
            <>
              <X size={16} />
              Cancel
            </>
          ) : (
            <>
              <Plus size={17} />
              Create Playlist
            </>
          )}
        </button>
      </header>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-4 py-3">
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
          CREATE FORM
      ===================================================== */}

      {showCreate && (
        <form
          onSubmit={handleCreatePlaylist}
          className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <ListVideo size={19} />
            </div>

            <div>
              <h2 className="font-semibold text-[var(--text-primary)]">
                Create a playlist
              </h2>

              <p className="text-xs text-[var(--text-secondary)]">
                Give your collection a name
                and description.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
                Playlist name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="e.g. My favorite videos"
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value,
                  )
                }
                placeholder="What is this playlist about?"
                rows={4}
                className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-6 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={
                  creating ||
                  !name.trim() ||
                  !description.trim()
                }
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {creating ? (
                  <>
                    <LoaderCircle
                      size={16}
                      className="animate-spin"
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Create Playlist
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {playlists.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-hover)] text-[var(--text-muted)]">
            <ListVideo size={27} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-[var(--text-primary)]">
            No playlists yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
            Create your first playlist to
            organize your favorite videos.
          </p>

          {!showCreate && (
            <button
              type="button"
              onClick={() =>
                setShowCreate(true)
              }
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] active:scale-95"
            >
              <Plus size={16} />
              Create Playlist
            </button>
          )}
        </div>
      ) : (
        /* ===================================================
           PLAYLIST GRID
        =================================================== */

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist) => {
            const videoCount =
              playlist.video?.length || 0;

            const previewVideo =
              playlist.video?.[0];

            return (
              <article
                key={playlist._id}
                className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-lg"
              >
                {/* Preview */}

                <Link
                  to={`/playlists/${playlist._id}`}
                  className="block"
                >
                  <div className="relative aspect-video overflow-hidden bg-[var(--surface-hover)]">
                    {previewVideo?.thumbnail ? (
                      <img
                        src={
                          previewVideo.thumbnail
                        }
                        alt={playlist.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface)] text-[var(--accent)] shadow-sm">
                          <Play
                            size={23}
                            fill="currentColor"
                          />
                        </div>
                      </div>
                    )}

                    {/* Video count badge */}

                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/75 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                      <ListVideo size={13} />

                      {videoCount}
                    </div>
                  </div>

                  {/* Info */}

                  <div className="p-5">
                    <h2 className="truncate text-base font-semibold text-[var(--text-primary)]">
                      {playlist.name}
                    </h2>

                    <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">
                      {playlist.description}
                    </p>

                    <p className="mt-4 text-xs font-medium text-[var(--text-muted)]">
                      {videoCount}{" "}
                      {videoCount === 1
                        ? "video"
                        : "videos"}
                    </p>
                  </div>
                </Link>

                {/* Delete */}

                <div className="border-t border-[var(--border)] px-5 py-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleDeletePlaylist(
                        playlist._id,
                      )
                    }
                    disabled={
                      deletingId ===
                      playlist._id
                    }
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId ===
                    playlist._id ? (
                      <>
                        <LoaderCircle
                          size={14}
                          className="animate-spin"
                        />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={14} />
                        Delete playlist
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Playlists;