import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import {
  getPlaylistById,
  removeVideoFromPlaylist,
} from "../api/playlist.api.js";

function PlaylistDetails() {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const { accessToken, isAuthenticated } = useAuth();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [removingId, setRemovingId] = useState(null);

  // Fetch playlist
  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!isAuthenticated || !accessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getPlaylistById(
          playlistId,
          accessToken,
        );

        setPlaylist(response.data);
      } catch (error) {
        console.error(error);

        setError(
          error.message ||
            "Failed to load playlist",
        );
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) {
      fetchPlaylist();
    }
  }, [playlistId, accessToken, isAuthenticated]);

  // Remove video
  const handleRemoveVideo = async (videoId) => {
    const confirmed = window.confirm(
      "Remove this video from the playlist?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingId(videoId);
      setError("");

      const response =
        await removeVideoFromPlaylist(
          videoId,
          playlistId,
          accessToken,
        );

      setPlaylist(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to remove video",
      );
    } finally {
      setRemovingId(null);
    }
  };

  // Login state
  if (!isAuthenticated) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold">
            Login to view this playlist
          </h1>

          <button
            onClick={() => navigate("/login")}
            className="mt-4 rounded-full bg-black px-5 py-2 text-sm font-medium text-white"
          >
            Login
          </button>
        </div>
      </main>
    );
  }

  // Loading
  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <p className="text-gray-500">
          Loading playlist...
        </p>
      </main>
    );
  }

  // Error
  if (error && !playlist) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <button
          onClick={() => navigate("/playlists")}
          className="text-sm font-medium text-gray-500 hover:text-black"
        >
          ← Back to Playlists
        </button>

        <div className="mt-8 rounded-xl bg-red-50 p-5 text-red-600">
          {error}
        </div>
      </main>
    );
  }

  if (!playlist) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <p className="text-gray-500">
          Playlist not found.
        </p>
      </main>
    );
  }

  const videos = playlist.video || [];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      {/* Back */}
      <button
        onClick={() => navigate("/playlists")}
        className="text-sm font-medium text-gray-500 transition hover:text-black"
      >
        ← Back to Playlists
      </button>

      {/* Playlist header */}
      <section className="mt-5 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row">
          {/* Playlist image */}
          <div className="h-40 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-36 sm:w-56">
            {videos[0]?.thumbnail ? (
              <img
                src={videos[0].thumbnail}
                alt={playlist.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl">
                ▶
              </div>
            )}
          </div>

          {/* Information */}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold">
              {playlist.name}
            </h1>

            <p className="mt-2 leading-6 text-gray-600">
              {playlist.description}
            </p>

            <div className="mt-4 text-sm text-gray-500">
              {videos.length}{" "}
              {videos.length === 1
                ? "video"
                : "videos"}
            </div>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Videos */}
      <section className="mt-8">
        <h2 className="text-xl font-bold">
          Videos
        </h2>

        {videos.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed p-10 text-center">
            <div className="text-4xl">
              📺
            </div>

            <h3 className="mt-3 font-semibold">
              This playlist is empty
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Add videos to this playlist from
              the video page.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {videos.map((video) => (
              <div
                key={video._id}
                className="flex gap-4 rounded-xl border bg-white p-3 transition hover:shadow-sm"
              >
                {/* Thumbnail */}
                <Link
                  to={`/watch/${video._id}`}
                  className="h-24 w-40 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-28 sm:w-48"
                >
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      ▶
                    </div>
                  )}
                </Link>

                {/* Video information */}
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/watch/${video._id}`}
                    className="font-semibold hover:underline"
                  >
                    {video.title}
                  </Link>

                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {video.description}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    {video.views ?? 0} views
                  </p>
                </div>

                {/* Remove */}
                <div className="flex items-start">
                  <button
                    onClick={() =>
                      handleRemoveVideo(
                        video._id,
                      )
                    }
                    disabled={
                      removingId === video._id
                    }
                    className="rounded-lg px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {removingId === video._id
                      ? "Removing..."
                      : "Remove"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default PlaylistDetails;