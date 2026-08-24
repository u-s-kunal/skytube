import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideoById } from "../api/video.api.js";

function Watch() {
  const { videoId } = useParams();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await getVideoById(videoId);

        console.log("Video response:", response);

        setVideo(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (loading) {
    return <h2>Loading video...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!video) {
    return <h2>Video not found</h2>;
  }

  return (
    <main className="watch-page">
      <video
        className="watch-player"
        controls
        autoPlay
      >
        <source
          src={video.videoFile}
          type="video/mp4"
        />

        Your browser does not support the video tag.
      </video>

      <h1>{video.title}</h1>

      <p>{video.description}</p>

      <p>{video.views} views</p>
    </main>
  );
}

export default Watch;