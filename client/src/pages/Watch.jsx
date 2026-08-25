import { useEffect, useState } from "react";
import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";
import Comments from "../components/Comments.jsx";
import { getVideoById } from "../api/video.api.js";
import {
  toggleVideoLike,
  checkVideoLike,
} from "../api/like.api.js";
import { useAuth } from "../hooks/useAuth.js";

function Watch() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const {
    accessToken,
    isAuthenticated,
  } = useAuth();

  const [video, setVideo] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getVideoById(videoId);


        setVideo(response.data);
        console.log("VIDEO DATA:", response.data);

      } catch (error) {
        console.error(error);
        setError("Failed to load video");
      } finally {
        setLoading(false);
      }
    };


    fetchVideo();
  }, [videoId]);

  useEffect(() => {
  const checkLike = async () => {
    if (!isAuthenticated || !accessToken) {
      setIsLiked(false);
      return;
    }

    try {
      const response = await checkVideoLike(
        videoId,
        accessToken,
      );

      setIsLiked(response.data.liked);
    } catch (error) {
      console.error(
        "Failed to check like status:",
        error,
      );
    }
  };

  checkLike();
}, [videoId, accessToken, isAuthenticated]);

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

      const response = await toggleVideoLike(
          videoId,
          accessToken,
        );

        setIsLiked(response.data.liked);

        setVideo((prev) => ({
          ...prev,
          likesCount: response.data.liked
            ? (prev.likesCount ?? 0) + 1
            : Math.max((prev.likesCount ?? 0) - 1, 0),
        }));
      
      
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLikeLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <p className="mt-4 text-gray-500">
            Loading video...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-red-500">
            {error}
          </p>

          <Link
            to="/"
            className="mt-4 inline-block rounded-lg bg-black px-5 py-2 text-white"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-gray-500">
          Video not found.
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      {/* Video Player */}
      <div className="overflow-hidden rounded-xl bg-black shadow-sm">
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

          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video title */}
      <section className="mt-5">
        <h1 className="text-xl font-bold leading-7 sm:text-2xl">
          {video.title}
        </h1>

        {/* Metadata + actions */}
        <div className="mt-3 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-500">
            <span>
              {video.views} views
            </span>

            <span className="mx-2">
              •
            </span>

            <span>
              {new Date(video.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Like */}
         <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                isLiked
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg">
                {isLiked ? "👍" : "♡"}
              </span>

              {likeLoading
                ? "..."
                : isLiked
                  ? "Liked"
                  : "Like"}
            </button>

            <span className="text-sm text-gray-500">
              {video.likesCount ?? 0} likes
            </span>
          </div>
        </div>
      </section>

      {/* Channel */}
      <section className="mt-5 flex items-center gap-4 border-b pb-5">
        {video.owner?.avatar && (
          <img
            src={video.owner.avatar}
            alt={video.owner.userName}
            className="h-12 w-12 rounded-full object-cover"
          />
        )}

        <div>
          {video.owner?.userName ? (
            <Link
              to={`/channel/${video.owner.userName}`}
              className="font-semibold hover:underline"
            >
              {video.owner.userName}
            </Link>
          ) : (
            <p className="font-semibold">
              Channel
            </p>
          )}

          <p className="text-sm text-gray-500">
            Video creator
          </p>
        </div>
      </section>

      {/* Description */}
      <section className="mt-5 rounded-xl bg-gray-100 p-4">
        <h2 className="mb-2 font-semibold">
          Description
        </h2>

        <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
          {video.description}
        </p>
      </section>
      {/* Comment section */}
      <Comments videoId={videoId} />
    </main>
  );
}

export default Watch;