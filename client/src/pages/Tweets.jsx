import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  MessageSquare,
  PenLine,
} from "lucide-react";

import { getUserTweets } from "../api/tweet.api.js";
import TweetForm from "../components/TweetForm.jsx";
import TweetCard from "../components/TweetCard.jsx";

import { useAuth } from "../hooks/useAuth.js";

function Tweets() {
  const {
    user,
    accessToken,
    isAuthenticated,
  } = useAuth();

  const navigate = useNavigate();

  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // FETCH TWEETS
  // ==================================================

  useEffect(() => {
    const fetchTweets = async () => {
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
          await getUserTweets(
            user._id,
            accessToken,
          );

        setTweets(response.data || []);
      } catch (error) {
        console.error(error);

        setError(
          error.message ||
            "Failed to load tweets",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [
    user,
    accessToken,
    isAuthenticated,
  ]);

  // ==================================================
  // TWEET CREATED
  // ==================================================

  const handleTweetCreated = (
    newTweet,
  ) => {
    setTweets((prev) => [
      newTweet,
      ...prev,
    ]);
  };

  // ==================================================
  // TWEET UPDATED
  // ==================================================

  const handleTweetUpdated = (
    updatedTweet,
  ) => {
    setTweets((prev) =>
      prev.map((tweet) =>
        tweet._id === updatedTweet._id
          ? updatedTweet
          : tweet,
      ),
    );
  };

  // ==================================================
  // TWEET DELETED
  // ==================================================

  const handleTweetDeleted = (
    deletedTweetId,
  ) => {
    setTweets((prev) =>
      prev.filter(
        (tweet) =>
          tweet._id !== deletedTweetId,
      ),
    );
  };

  // ==================================================
  // NOT LOGGED IN
  // ==================================================

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <MessageSquare size={26} />
          </div>

          <h1 className="mt-5 text-xl font-bold text-[var(--text-primary)]">
            Login to view your tweets
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            You need to be logged in to
            create and manage tweets.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
            className="mt-6 rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
          >
            Login
          </button>

        </div>
      </main>
    );
  }

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Header skeleton */}

        <div className="h-8 w-32 animate-pulse rounded-lg bg-[var(--surface-hover)]" />

        {/* Content skeleton */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)]">

          <div className="h-48 animate-pulse rounded-3xl bg-[var(--surface-hover)]" />

          <div className="space-y-4">
            <div className="h-40 animate-pulse rounded-2xl bg-[var(--surface-hover)]" />
            <div className="h-40 animate-pulse rounded-2xl bg-[var(--surface-hover)]" />
          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <header className="mb-6">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <MessageSquare size={20} />
          </div>

          <div className="min-w-0">

            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Tweets
            </h1>

            <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
              Share what's on your mind.
            </p>

          </div>

        </div>

      </header>

      {/* ==================================================
          MAIN LAYOUT
      ================================================== */}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)]">

        {/* ==================================================
            LEFT — CREATE TWEET
        ================================================== */}

        <aside className="lg:sticky lg:top-24">

          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">

            <PenLine size={16} />

            <span>
              Create a tweet
            </span>

          </div>

          <TweetForm
            onTweetCreated={
              handleTweetCreated
            }
          />

          {/* Information card */}

          <div className="mt-4 hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 lg:block">

            <p className="text-xs font-medium text-[var(--text-secondary)]">
              Your tweets
            </p>

            <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
              Share updates, thoughts,
              or anything you want your
              audience to see.
            </p>

          </div>

        </aside>

        {/* ==================================================
            RIGHT — TWEET FEED
        ================================================== */}

        <section className="min-w-0">

          {/* ==================================================
              FEED HEADER
          ================================================== */}

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Your tweets
              </h2>

              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                {tweets.length}{" "}
                {tweets.length === 1
                  ? "tweet"
                  : "tweets"}
              </p>
            </div>

          </div>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mb-5 rounded-2xl border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-4 py-3">
              <p className="text-sm text-[var(--danger)]">
                {error}
              </p>
            </div>
          )}

          {/* ==================================================
              EMPTY STATE
          ================================================== */}

          {tweets.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <MessageSquare size={25} />
              </div>

              <h2 className="mt-5 font-semibold text-[var(--text-primary)]">
                No tweets yet
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
                Share your first thought
                with your audience.
                Your tweets will appear
                here.
              </p>

            </div>
          ) : (

            /* ==================================================
               TWEET SCROLL CONTAINER

               Mobile:
               Normal page scrolling.

               Desktop:
               Only this area scrolls.
            ================================================== */

            <div
              className="
                lg:max-h-[calc(100vh-13rem)]
                lg:overflow-y-auto
                lg:overscroll-contain
                lg:pr-2
              "
            >

              <div className="space-y-4">

                {tweets.map((tweet) => (
                  <TweetCard
                    key={tweet._id}
                    tweet={tweet}
                    onTweetUpdated={
                      handleTweetUpdated
                    }
                    onTweetDeleted={
                      handleTweetDeleted
                    }
                  />
                ))}

              </div>

            </div>
          )}

        </section>

      </div>

    </main>
  );
}

export default Tweets;