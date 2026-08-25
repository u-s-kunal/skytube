import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getLikedVideos } from "../api/like.api.js";
import { useAuth } from "../hooks/useAuth.js";

function LikedVideos() {
  const { accessToken } = useAuth();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getLikedVideos(
          accessToken,
        );

        console.log(
          "Liked videos:",
          response,
        );

        setVideos(response.data || []);
      } catch (error) {
        console.error(error);
        setError("Failed to load liked videos");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchLikedVideos();
    }
  }, [accessToken]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">
          Loading liked videos...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Liked Videos
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Videos you have liked
        </p>
      </div>

      {videos.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium">
              No liked videos yet
            </p>

            <Link
              to="/"
              className="mt-4 inline-block rounded-lg bg-black px-5 py-2 text-sm text-white"
            >
              Explore Videos
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <Link
              key={video._id}
              to={`/watch/${video._id}`}
              className="group overflow-hidden rounded-xl"
            >
              {/* Thumbnail */}
              <div className="aspect-video overflow-hidden rounded-xl bg-gray-200">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>

              {/* Video information */}
              <div className="mt-3">
                <h2 className="line-clamp-2 font-semibold">
                  {video.title}
                </h2>

                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {video.description}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  {video.views ?? 0} views
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

export default LikedVideos;