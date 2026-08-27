import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getVideos } from "../api/video.api.js";
import VideoGrid from "../components/VideoGrid.jsx";

function Home() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query") || "";

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getVideos({
          query,
        });

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
  }, [query]);

  if (loading) {
    return <h2>Loading videos...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <main>
      {query && (
        <h2 className="mb-5 text-xl font-semibold">
          Search results for "{query}"
        </h2>
      )}

      {videos.length === 0 ? (
        <p>
          {query
            ? `No videos found for "${query}".`
            : "No videos found."}
        </p>
      ) : (
        <VideoGrid videos={videos} />
      )}
    </main>
  );
}

export default Home;