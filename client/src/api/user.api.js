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

export const updateAccountDetails = async (data, accessToken) => {
  const response = await fetch(`${API_URL}/users/update-account-details`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update account details");
  }

  return result;
};
export const updateAvatar = async (file, accessToken) => {
  const formData = new FormData();

  formData.append("avatar", file);

  const response = await fetch(`${API_URL}/users/update-avatar`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update avatar");
  }

  return result;
};
export const updateCoverImage = async (file, accessToken) => {
  const formData = new FormData();

  formData.append("coverImage", file);

  const response = await fetch(`${API_URL}/users/update-cover-image`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update cover image");
  }

  return result;
};
export const removeAvatar = async (accessToken) => {
  const response = await fetch(`${API_URL}/users/remove-avatar`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to remove avatar");
  }

  return result;
};
export const removeCoverImage = async (accessToken) => {
  const response = await fetch(`${API_URL}/users/remove-cover-image`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to remove cover image");
  }

  return result;
};
