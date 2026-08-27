const API_URL = import.meta.env.VITE_API_URL;

// Create playlist
export const createPlaylist = async (name, description, accessToken) => {
  const response = await fetch(`${API_URL}/playlists`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name,
      description,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create playlist");
  }

  return data;
};

// Get user's playlists
export const getUserPlaylists = async (userId, accessToken) => {
  const response = await fetch(`${API_URL}/playlists/user/${userId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch playlists");
  }

  return data;
};

// Get single playlist
export const getPlaylistById = async (playlistId, accessToken) => {
  const response = await fetch(`${API_URL}/playlists/${playlistId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch playlist");
  }

  return data;
};

// Update playlist
export const updatePlaylist = async (
  playlistId,
  name,
  description,
  accessToken,
) => {
  const response = await fetch(`${API_URL}/playlists/${playlistId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name,
      description,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update playlist");
  }

  return data;
};

// Delete playlist
export const deletePlaylist = async (playlistId, accessToken) => {
  const response = await fetch(`${API_URL}/playlists/${playlistId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete playlist");
  }

  return data;
};

// Add video to playlist
export const addVideoToPlaylist = async (videoId, playlistId, accessToken) => {
  const response = await fetch(
    `${API_URL}/playlists/add/${videoId}/${playlistId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add video to playlist");
  }

  return data;
};

// Remove video from playlist
export const removeVideoFromPlaylist = async (
  videoId,
  playlistId,
  accessToken,
) => {
  const response = await fetch(
    `${API_URL}/playlists/remove/${videoId}/${playlistId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to remove video from playlist");
  }

  return data;
};
