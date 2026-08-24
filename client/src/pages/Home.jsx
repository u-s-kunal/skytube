import { useEffect, useState } from "react";
import { getVideos } from "../api/api.js";
import VideoGrid from "../components/VideoGrid.jsx";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await getVideos();

        console.log("Backend response:", response);

        setVideos(response.data?.docs || []);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <h2>Loading videos...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <main>
      <h1>SkyTube</h1>

      {videos.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <VideoGrid videos={videos} />
      )}
    </main>
  );
}

export default Home;