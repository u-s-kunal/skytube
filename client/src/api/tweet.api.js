const API_URL = import.meta.env.VITE_API_URL;

// Create tweet
export const createTweet = async (content, accessToken) => {
  const response = await fetch(`${API_URL}/tweets`, {
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
    throw new Error(data.message || "Failed to create tweet");
  }

  return data;
};

// Get user's tweets
export const getUserTweets = async (userId, accessToken) => {
  const response = await fetch(`${API_URL}/tweets/user/${userId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch tweets");
  }

  return data;
};

// Update tweet
export const updateTweet = async (tweetId, content, accessToken) => {
  const response = await fetch(`${API_URL}/tweets/${tweetId}`, {
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
    throw new Error(data.message || "Failed to update tweet");
  }

  return data;
};

// Delete tweet
export const deleteTweet = async (tweetId, accessToken) => {
  const response = await fetch(`${API_URL}/tweets/${tweetId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete tweet");
  }

  return data;
};
