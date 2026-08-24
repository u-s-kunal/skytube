import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { getUserChannelProfile } from "../api/user.api.js";

function Channel() {
  const { username } = useParams();

  const { accessToken } = useAuth();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        if (!accessToken) {
          setError("Please login to view this channel.");
          return;
        }

        const response = await getUserChannelProfile(
          username,
          accessToken,
        );

        setChannel(response.data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [username, accessToken]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p>Loading channel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!channel) {
    return <p>Channel not found.</p>;
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Cover image */}
      <div className="h-48 overflow-hidden bg-gray-200 sm:h-64">
        {channel.coverImage ? (
          <img
            src={channel.coverImage}
            alt="Channel cover"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No cover image
          </div>
        )}
      </div>

      {/* Channel information */}
      <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center">
        <img
          src={channel.avatar}
          alt={channel.userName}
          className="h-24 w-24 rounded-full border-4 border-white object-cover"
        />

        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {channel.fullName}
          </h1>

          <p className="text-gray-500">
            @{channel.userName}
          </p>

          <div className="mt-2 flex gap-4 text-sm text-gray-600">
            <span>
              {channel.subscribersCount} subscribers
            </span>

            <span>
              {channel.channelsSubscribedToCount} subscriptions
            </span>
          </div>
        </div>

        <button className="rounded-full bg-black px-6 py-3 font-medium text-white">
          {channel.isSubscribed
            ? "Subscribed"
            : "Subscribe"}
        </button>
      </div>
    </div>
  );
}

export default Channel;