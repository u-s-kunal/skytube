import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Check,
  UserPlus,
} from "lucide-react";

import {
  toggleSubscription,
  checkSubscription,
  getSubscriberCount,
} from "../api/subscription.api.js";

import { useAuth } from "../hooks/useAuth.js";

function SubscribeButton({
  channelId,
  onSubscriptionChange,
}) {
  const navigate = useNavigate();

  const {
    accessToken,
    isAuthenticated,
  } = useAuth();

  const [subscribed, setSubscribed] =
    useState(false);

  const [subscribersCount, setSubscribersCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  // =====================================================
  // FETCH SUBSCRIPTION DATA
  // =====================================================

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!channelId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // -------------------------------------------------
        // Subscriber count is public
        // -------------------------------------------------

        const countResponse =
          await getSubscriberCount(
            channelId,
          );

        const count =
          countResponse.data
            ?.subscribersCount ?? 0;

        setSubscribersCount(count);

        // -------------------------------------------------
        // Subscription status requires authentication
        // -------------------------------------------------

        if (
          !isAuthenticated ||
          !accessToken
        ) {
          setSubscribed(false);
          return;
        }

        const statusResponse =
          await checkSubscription(
            channelId,
            accessToken,
          );

        setSubscribed(
          statusResponse.data
            ?.subscribed ?? false,
        );
      } catch (error) {
        console.error(
          "Failed to load subscription data:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [
    channelId,
    accessToken,
    isAuthenticated,
  ]);

  // =====================================================
  // TOGGLE SUBSCRIPTION
  // =====================================================

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from:
            window.location.pathname,
        },
      });

      return;
    }

    if (actionLoading) {
      return;
    }

    try {
      setActionLoading(true);

      const response =
        await toggleSubscription(
          channelId,
          accessToken,
        );

      const isNowSubscribed =
        response.data?.subscribed ??
        false;

      setSubscribed(
        isNowSubscribed,
      );

      // -------------------------------------------------
      // IMPORTANT:
      // Never calculate count locally with +1 / -1.
      // Get the real count from backend.
      // -------------------------------------------------

      const countResponse =
        await getSubscriberCount(
          channelId,
          accessToken,
        );

      const actualCount =
        countResponse.data
          ?.subscribersCount ?? 0;

      setSubscribersCount(
        actualCount,
      );

      // -------------------------------------------------
      // Tell Channel.jsx about the new count
      // -------------------------------------------------

      if (
        onSubscriptionChange
      ) {
        onSubscriptionChange(
          actualCount,
        );
      }
    } catch (error) {
      console.error(
        "Subscription failed:",
        error,
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex flex-wrap items-center gap-3">

        <div className="h-10 w-32 animate-pulse rounded-full bg-[var(--surface-hover)]" />

        <div className="h-4 w-24 animate-pulse rounded bg-[var(--surface-hover)]" />

      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">

      {/* Subscribe button */}

      <button
        type="button"
        onClick={handleSubscribe}
        disabled={actionLoading}
        className={`group flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
          subscribed
            ? "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
            : "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
        }`}
      >

        {actionLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />

            <span>
              Updating...
            </span>
          </>
        ) : subscribed ? (
          <>
            <Check
              size={16}
              strokeWidth={2.5}
            />

            <span>
              Subscribed
            </span>
          </>
        ) : (
          <>
            <UserPlus size={16} />

            <span>
              Subscribe
            </span>
          </>
        )}

      </button>

      {/* Subscriber count */}

      <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">

        <Bell
          size={15}
          className="shrink-0 text-[var(--text-muted)]"
        />

        <span className="font-medium text-[var(--text-primary)]">
          {subscribersCount.toLocaleString()}
        </span>

        <span>
          {subscribersCount === 1
            ? "subscriber"
            : "subscribers"}
        </span>

      </div>

    </div>
  );
}

export default SubscribeButton;