const API_URL = import.meta.env.VITE_API_URL;

// Get all videos
export const getVideos = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();

  const response = await fetch(
    `${API_URL}/videos${queryParams ? `?${queryParams}` : ""}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch videos");
  }

  return response.json();
};

// Get single video
export const getVideoById = async (videoId) => {
  const response = await fetch(`${API_URL}/videos/${videoId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch video");
  }

  return response.json();
};

export const publishVideo = async (formData, accessToken) => {
  const response = await fetch(`${API_URL}/videos`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload video");
  }

  return data;
};
