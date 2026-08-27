import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { getSubscribedChannels } from "../api/subscription.api.js";
import {toggleSubscription} from "../api/subscription.api.js";

function Subscriptions() {
  const { user, accessToken, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!isAuthenticated || !user?._id || !accessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getSubscribedChannels(
          user._id,
          accessToken,
        );

        setChannels(response.data || []);
      } catch (error) {
        console.error(error);
        setError(
          error.message ||
            "Failed to load subscriptions",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user, accessToken, isAuthenticated]);
    
    const handleUnsubscribe = async (channelId) => {
  try {
    setActionLoading(channelId);

    await toggleSubscription(
      channelId,
      accessToken,
    );

    setChannels((prev) =>
      prev.filter(
        (subscription) =>
          subscription.channel?._id !== channelId,
      ),
    );
  } catch (error) {
    console.error(error);

    alert(
      error.message ||
        "Failed to unsubscribe",
    );
  } finally {
    setActionLoading(null);
  }
};

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold">
            Login to view your subscriptions
          </h1>

          <button
            onClick={() => navigate("/login")}
            className="mt-4 rounded-full bg-black px-5 py-2 text-sm font-medium text-white"
          >
            Login
          </button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-bold">
          Subscriptions
        </h1>

        <p className="mt-6 text-gray-500">
          Loading subscriptions...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-bold">
          Subscriptions
        </h1>

        <p className="mt-6 text-red-500">
          {error}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold">
        Subscriptions
      </h1>

      {channels.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            You haven't subscribed to any channels yet.
          </p>

          <Link
            to="/"
            className="mt-4 inline-block rounded-full bg-black px-5 py-2 text-sm font-medium text-white"
          >
            Explore videos
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((subscription) => {
                const channel = subscription.channel;

                if (!channel) {
                    return null;
                }

                return (
                    <div
                    key={subscription._id}
                    className="flex items-center gap-4 rounded-xl border p-4 transition hover:bg-gray-50"
                    >
                    <Link
                        to={`/channel/${channel.userName}`}
                        className="flex min-w-0 flex-1 items-center gap-4"
                    >
                        <img
                        src={
                            channel.avatar ||
                            "/default-avatar.png"
                        }
                        alt={channel.userName}
                        className="h-14 w-14 shrink-0 rounded-full object-cover"
                        />

                        <div className="min-w-0">
                        <h2 className="truncate font-semibold">
                            {channel.fullName}
                        </h2>

                        <p className="truncate text-sm text-gray-500">
                            @{channel.userName}
                        </p>
                        </div>
                    </Link>

                    <button
                        onClick={() =>
                        handleUnsubscribe(channel._id)
                        }
                        disabled={
                        actionLoading === channel._id
                        }
                        className="shrink-0 rounded-full bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-800 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {actionLoading === channel._id
                        ? "..."
                        : "Subscribed"}
                    </button>
                    </div>
                );
                })}
        </div>
      )}
    </main>
  );
}

export default Subscriptions;