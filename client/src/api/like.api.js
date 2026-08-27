const API_URL = import.meta.env.VITE_API_URL;

// Like / unlike a video
export const toggleVideoLike = async (videoId, accessToken) => {
  const response = await fetch(`${API_URL}/likes/toggle/v/${videoId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to toggle video like");
  }

  return data;
};

// Get videos liked by current user
export const getLikedVideos = async (accessToken) => {
  const response = await fetch(`${API_URL}/likes/videos`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch liked videos");
  }

  return data;
};
export const checkVideoLike = async (videoId, accessToken) => {
  const response = await fetch(`${API_URL}/likes/video/${videoId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to check video like");
  }

  return data;
};

//COMMENT LIKES SECTION :

export const toggleCommentLike = async (commentId, accessToken) => {
  const response = await fetch(`${API_URL}/likes/toggle/c/${commentId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to toggle comment like");
  }

  return data;
};
