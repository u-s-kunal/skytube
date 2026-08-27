import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Check,
  ChevronRight,
  Tv,
  User,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth.js";

import {
  getSubscribedChannels,
  toggleSubscription,
} from "../api/subscription.api.js";

function Subscriptions() {
  const {
    user,
    accessToken,
    isAuthenticated,
  } = useAuth();

  const navigate = useNavigate();

  const [actionLoading, setActionLoading] =
    useState(null);

  const [channels, setChannels] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // FETCH SUBSCRIPTIONS
  // =====================================================

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (
        !isAuthenticated ||
        !user?._id ||
        !accessToken
      ) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getSubscribedChannels(
            user._id,
            accessToken,
          );

        setChannels(
          response.data || [],
        );
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
  }, [
    user,
    accessToken,
    isAuthenticated,
  ]);

  // =====================================================
  // UNSUBSCRIBE
  // =====================================================

  const handleUnsubscribe =
    async (channelId) => {
      try {
        setActionLoading(channelId);

        await toggleSubscription(
          channelId,
          accessToken,
        );

        setChannels((prev) =>
          prev.filter(
            (subscription) =>
              subscription.channel?._id !==
              channelId,
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

  // =====================================================
  // NOT AUTHENTICATED
  // =====================================================

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">

        <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-sm sm:p-8">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <Tv size={25} />
          </div>

          <h1 className="mt-5 text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
            Login to view your subscriptions
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
            Sign in to see the channels
            you're subscribed to.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
            className="mt-6 w-full rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] sm:w-auto"
          >
            Login
          </button>

        </div>

      </main>
    );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">

        {/* Header skeleton */}

        <div className="h-7 w-36 animate-pulse rounded-lg bg-[var(--surface-hover)] sm:h-8 sm:w-44" />

        <div className="mt-2 h-4 w-52 animate-pulse rounded bg-[var(--surface-hover)]" />

        {/* Cards */}

        <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">

          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:gap-4"
            >
              <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-[var(--surface-hover)]" />

              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--surface-hover)]" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--surface-hover)]" />
              </div>

              <div className="h-9 w-20 shrink-0 animate-pulse rounded-full bg-[var(--surface-hover)]" />
            </div>
          ))}

        </div>

      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center justify-center px-4 py-8">

        <div className="w-full max-w-md rounded-3xl border border-[var(--danger)]/20 bg-[var(--danger)]/10 p-6 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--danger)]/10 text-[var(--danger)]">
            <Tv size={23} />
          </div>

          <h1 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
            Couldn't load subscriptions
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--danger)]">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
          >
            Try again
          </button>

        </div>

      </main>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <header>

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <Tv size={20} />
          </div>

          <div className="min-w-0">

            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
              Subscriptions
            </h1>

            <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
              Channels you're following
            </p>

          </div>

        </div>

      </header>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {channels.length === 0 ? (
        <div className="mx-auto mt-10 w-full max-w-lg rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-12 text-center sm:mt-12 sm:px-8 sm:py-16">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <Tv size={26} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-[var(--text-primary)]">
            No subscriptions yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
            You haven't subscribed to any
            channels yet. Explore videos
            and find creators you enjoy.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] sm:w-auto"
          >
            Explore videos
            <ChevronRight size={16} />
          </Link>

        </div>
      ) : (
        <>
          {/* =================================================
              CHANNEL COUNT
          ================================================= */}

          <div className="mt-6 flex items-center justify-between">

            <p className="text-sm text-[var(--text-secondary)]">

              <span className="font-semibold text-[var(--text-primary)]">
                {channels.length}
              </span>{" "}

              {channels.length === 1
                ? "channel"
                : "channels"}

            </p>

          </div>

          {/* =================================================
              CHANNEL GRID
          ================================================= */}

          <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">

            {channels.map(
              (subscription) => {
                const channel =
                  subscription.channel;

                if (!channel) {
                  return null;
                }

                const isUnsubscribing =
                  actionLoading ===
                  channel._id;

                return (
                  <article
                    key={
                      subscription._id
                    }
                    className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 transition duration-200 hover:border-[var(--accent)]/30 hover:shadow-sm sm:p-4"
                  >

                    {/* =====================================
                        CHANNEL INFORMATION
                    ===================================== */}

                    <Link
                      to={`/channel/${channel.userName}`}
                      className="flex min-w-0 items-center gap-3 rounded-xl p-1 transition hover:bg-[var(--surface-hover)] sm:gap-4"
                    >

                      {/* Avatar */}

                      {channel.avatar ? (
                        <img
                          src={
                            channel.avatar
                          }
                          alt={
                            channel.userName
                          }
                          className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-[var(--border)] sm:h-16 sm:w-16"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)] sm:h-16 sm:w-16">
                          <User size={22} />
                        </div>
                      )}

                      {/* Name */}

                      <div className="min-w-0 flex-1">

                        <h2 className="truncate text-sm font-semibold text-[var(--text-primary)] sm:text-base">
                          {channel.fullName ||
                            channel.userName}
                        </h2>

                        <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)] sm:text-sm">
                          @{channel.userName}
                        </p>

                      </div>

                    </Link>

                    {/* =====================================
                        UNSUBSCRIBE BUTTON
                    ===================================== */}

                    <button
                      type="button"
                      onClick={() =>
                        handleUnsubscribe(
                          channel._id,
                        )
                      }
                      disabled={
                        isUnsubscribing
                      }
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--danger)]/30 hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] disabled:cursor-not-allowed disabled:opacity-50 sm:mt-4"
                    >

                      {isUnsubscribing ? (
                        <>
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--text-muted)] border-t-transparent" />

                          Unsubscribing...
                        </>
                      ) : (
                        <>
                          <Check size={15} />

                          Subscribed
                        </>
                      )}

                    </button>

                  </article>
                );
              },
            )}

          </div>
        </>
      )}

    </main>
  );
}

export default Subscriptions;