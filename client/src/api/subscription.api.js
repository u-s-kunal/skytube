const API_URL = import.meta.env.VITE_API_URL;

// Subscribe / unsubscribe from a channel
export const toggleSubscription = async (channelId, accessToken) => {
  const response = await fetch(`${API_URL}/subscriptions/c/${channelId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update subscription");
  }

  return data;
};

// Check whether current user is subscribed
export const checkSubscription = async (channelId, accessToken) => {
  const response = await fetch(
    `${API_URL}/subscriptions/c/${channelId}/status`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to check subscription");
  }

  return data;
};

//GET subscribeD CHANNELS

export const getSubscribedChannels = async (subscriberId, accessToken) => {
  const response = await fetch(
    `${API_URL}/subscriptions/u/${subscriberId}/channels`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch subscribed channels");
  }

  return data;
};

// Get subscriber count
export const getSubscriberCount = async (channelId, accessToken) => {
  const response = await fetch(
    `${API_URL}/subscriptions/c/${channelId}/count`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get subscriber count");
  }

  return data;
};
