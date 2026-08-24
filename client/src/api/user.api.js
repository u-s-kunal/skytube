const API_URL = import.meta.env.VITE_API_URL;

export const getUserChannelProfile = async (username, accessToken) => {
  const response = await fetch(`${API_URL}/users/c/${username}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch channel");
  }

  return data;
};
