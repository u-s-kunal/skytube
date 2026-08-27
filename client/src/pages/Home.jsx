import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getVideos } from "../api/video.api.js";
import VideoGrid from "../components/VideoGrid.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";

function Home() {
  const [searchParams] = useSearchParams();

  const query =
    searchParams.get("query") || "";

  const [videos, setVideos] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // FETCH VIDEOS
  // =====================================================

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getVideos({
            query,
          });

        console.log(
          "Backend response:",
          response,
        );

        setVideos(
          response.data?.docs || [],
        );
      } catch (error) {
        console.error(error);

        setError(
          "Failed to fetch videos",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <LoadingScreen
        message="Connecting to SkyTube..."
      />
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">

        <div className="w-full max-w-md rounded-3xl border border-[var(--danger)]/20 bg-[var(--surface)] p-6 text-center shadow-sm sm:p-8">

          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-[var(--danger)]">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
          >
            Try again
          </button>

        </div>

      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">

      {/* Search heading */}

      {query && (
        <h2 className="mb-5 text-lg font-semibold text-[var(--text-primary)] sm:text-xl">
          Search results for "{query}"
        </h2>
      )}

      {/* Empty state */}

      {videos.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center">

          <div className="text-center">

            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              No videos found
            </h2>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {query
                ? `No videos found for "${query}".`
                : "There are no videos available yet."}
            </p>

          </div>

        </div>
      ) : (
        <VideoGrid videos={videos} />
      )}

    </main>
  );
}

export default Home;