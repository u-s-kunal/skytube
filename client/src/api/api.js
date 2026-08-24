const API_URL = import.meta.env.VITE_API_URL;

export const getVideos = async () => {
  const response = await fetch(`${API_URL}/videos`);

  if (!response.ok) {
    throw new Error("Failed to fetch videos");
  }

  return response.json();
};
