const API_URL = import.meta.env.VITE_API_URL;

// Get comments for a video
export const getVideoComments = async (videoId) => {
  const response = await fetch(`${API_URL}/comments/${videoId}`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch comments");
  }

  return data;
};

// Add a comment
export const addComment = async (videoId, content, accessToken) => {
  const response = await fetch(`${API_URL}/comments/${videoId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      content,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add comment");
  }

  return data;
};

// Update a comment
export const updateComment = async (commentId, content, accessToken) => {
  const response = await fetch(`${API_URL}/comments/c/${commentId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      content,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update comment");
  }

  return data;
};

// Delete a comment
export const deleteComment = async (commentId, accessToken) => {
  const response = await fetch(`${API_URL}/comments/c/${commentId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete comment");
  }

  return data;
};
