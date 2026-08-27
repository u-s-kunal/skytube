import { useEffect, useState } from "react";
import {
  Video,
  MessageSquare,
  Pencil,
  X,
  Camera,
  Trash2,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { getUserTweets } from "../api/tweet.api.js";
import TweetCard from "../components/TweetCard.jsx";

import { getVideos } from "../api/video.api.js";
import UploadVideo from "../components/UploadVideo.jsx";
import SubscribeButton from "../components/SubscribeButton.jsx";
import VideoGrid from "../components/VideoGrid.jsx";

import { useAuth } from "../hooks/useAuth.js";

import {
  getUserChannelProfile,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  removeAvatar,
  removeCoverImage,
} from "../api/user.api.js";

function Channel() {
  const { username } = useParams();
  const navigate = useNavigate();

  const {
    user,
    accessToken,
  } = useAuth();

  // =====================================================
  // CHANNEL
  // =====================================================

  const [channel, setChannel] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // VIDEOS
  // =====================================================

  const [videos, setVideos] =
    useState([]);

  const [videoRefresh, setVideoRefresh] =
    useState(0);

  const [videosLoading, setVideosLoading] =
    useState(true);

  const [videosError, setVideosError] =
    useState("");

  const [showUploadVideo, setShowUploadVideo] =
    useState(false);

  // =====================================================
  // TWEETS
  // =====================================================

  const [tweets, setTweets] =
    useState([]);

  const [tweetsLoading, setTweetsLoading] =
    useState(true);

  const [tweetsError, setTweetsError] =
    useState("");

  // =====================================================
  // ACTIVE TAB
  // =====================================================

  const [activeTab, setActiveTab] =
    useState("videos");

  // =====================================================
  // EDIT PROFILE
  // =====================================================

  const [showEdit, setShowEdit] =
    useState(false);

  const [savingProfile, setSavingProfile] =
    useState(false);

  // =====================================================
  // AVATAR
  // =====================================================

  const [uploadingAvatar, setUploadingAvatar] =
    useState(false);

  const [removingAvatar, setRemovingAvatar] =
    useState(false);

  // =====================================================
  // COVER
  // =====================================================

  const [uploadingCover, setUploadingCover] =
    useState(false);

  const [removingCover, setRemovingCover] =
    useState(false);

  // =====================================================
  // PROFILE MESSAGES
  // =====================================================

  const [profileError, setProfileError] =
    useState("");

  const [profileSuccess, setProfileSuccess] =
    useState("");

  // =====================================================
  // PROFILE FORM
  // =====================================================

  const [formData, setFormData] =
    useState({
      fullName: "",
      userName: "",
      email: "",
    });

  // =====================================================
  // FETCH CHANNEL
  // =====================================================

  useEffect(() => {
    const fetchChannel = async () => {
      if (!accessToken) {
        setLoading(false);
        setError(
          "Please login to view this channel.",
        );
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getUserChannelProfile(
            username,
            accessToken,
          );

        setChannel(response.data);
      } catch (error) {
        console.error(error);

        setError(
          error.message ||
            "Failed to load channel",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [
    username,
    accessToken,
  ]);

  // =====================================================
  // FETCH CHANNEL VIDEOS
  // =====================================================

  useEffect(() => {
    const fetchChannelVideos = async () => {
      if (!channel?._id) {
        return;
      }

      try {
        setVideosLoading(true);
        setVideosError("");

        const response =
          await getVideos({
            userId: channel._id,
            limit: 20,
          });

        setVideos(
          response.data?.docs || [],
        );
      } catch (error) {
        console.error(error);

        setVideosError(
          error.message ||
            "Failed to load channel videos",
        );
      } finally {
        setVideosLoading(false);
      }
    };

    fetchChannelVideos();
  }, [
    channel?._id,
    videoRefresh,
  ]);

  // =====================================================
  // FETCH CHANNEL TWEETS
  // =====================================================

  useEffect(() => {
    const fetchChannelTweets = async () => {
      if (
        !channel?._id ||
        !accessToken
      ) {
        return;
      }

      try {
        setTweetsLoading(true);
        setTweetsError("");

        const response =
          await getUserTweets(
            channel._id,
            accessToken,
          );

        setTweets(
          response.data || [],
        );
      } catch (error) {
        console.error(error);

        setTweetsError(
          error.message ||
            "Failed to load tweets",
        );
      } finally {
        setTweetsLoading(false);
      }
    };

    fetchChannelTweets();
  }, [
    channel?._id,
    accessToken,
  ]);

  // =====================================================
  // CHECK OWN CHANNEL
  // =====================================================

  const isOwnChannel =
    user?._id?.toString() ===
    channel?._id?.toString();

  // =====================================================
  // VIDEO UPLOAD SUCCESS
  // =====================================================

  const handleVideoUploaded = () => {
    setShowUploadVideo(false);

    setVideoRefresh(
      (prev) => prev + 1,
    );
  };

  // =====================================================
  // OPEN EDIT PROFILE
  // =====================================================

  const handleOpenEdit = () => {
    setFormData({
      fullName:
        channel.fullName || "",

      userName:
        channel.userName || "",

      email:
        channel.email || "",
    });

    setProfileError("");
    setProfileSuccess("");

    setShowEdit(true);
  };

  // =====================================================
  // CLOSE EDIT PROFILE
  // =====================================================

  const handleCloseEdit = () => {
    setShowEdit(false);
    setProfileError("");
    setProfileSuccess("");
  };

  // =====================================================
  // FORM INPUT
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // =====================================================
  // UPDATE ACCOUNT DETAILS
  // =====================================================

  const handleUpdateProfile =
    async (e) => {
      e.preventDefault();

      try {
        setSavingProfile(true);
        setProfileError("");
        setProfileSuccess("");

        const oldUsername =
          channel.userName;

        const response =
          await updateAccountDetails(
            formData,
            accessToken,
          );

        const updatedChannel = {
          ...channel,
          ...response.data,
        };

        setChannel(
          updatedChannel,
        );

        setProfileSuccess(
          "Profile updated successfully.",
        );

        const newUsername =
          formData.userName
            .trim()
            .toLowerCase();

        if (
          newUsername !==
          oldUsername.toLowerCase()
        ) {
          navigate(
            `/channel/${newUsername}`,
            {
              replace: true,
            },
          );
        }
      } catch (error) {
        console.error(error);

        setProfileError(
          error.message ||
            "Failed to update profile",
        );
      } finally {
        setSavingProfile(false);
      }
    };

  // =====================================================
  // UPDATE AVATAR
  // =====================================================

  const handleAvatarChange =
    async (e) => {
      const file =
        e.target.files?.[0];

      if (!file) {
        return;
      }

      try {
        setUploadingAvatar(true);
        setProfileError("");
        setProfileSuccess("");

        const response =
          await updateAvatar(
            file,
            accessToken,
          );

        setChannel(
          (prev) => ({
            ...prev,
            ...response.data,
          }),
        );

        setProfileSuccess(
          "Avatar updated successfully.",
        );
      } catch (error) {
        console.error(error);

        setProfileError(
          error.message ||
            "Failed to update avatar",
        );
      } finally {
        setUploadingAvatar(false);
        e.target.value = "";
      }
    };

  // =====================================================
  // REMOVE AVATAR
  // =====================================================

  const handleRemoveAvatar =
    async () => {
      const confirmed =
        window.confirm(
          "Are you sure you want to remove your avatar?",
        );

      if (!confirmed) {
        return;
      }

      try {
        setRemovingAvatar(true);
        setProfileError("");
        setProfileSuccess("");

        const response =
          await removeAvatar(
            accessToken,
          );

        setChannel(
          (prev) => ({
            ...prev,
            ...response.data,
          }),
        );

        setProfileSuccess(
          "Avatar removed successfully.",
        );
      } catch (error) {
        console.error(error);

        setProfileError(
          error.message ||
            "Failed to remove avatar",
        );
      } finally {
        setRemovingAvatar(false);
      }
    };

  // =====================================================
  // UPDATE COVER
  // =====================================================

  const handleCoverChange =
    async (e) => {
      const file =
        e.target.files?.[0];

      if (!file) {
        return;
      }

      try {
        setUploadingCover(true);
        setProfileError("");
        setProfileSuccess("");

        const response =
          await updateCoverImage(
            file,
            accessToken,
          );

        setChannel(
          (prev) => ({
            ...prev,
            ...response.data,
          }),
        );

        setProfileSuccess(
          "Cover image updated successfully.",
        );
      } catch (error) {
        console.error(error);

        setProfileError(
          error.message ||
            "Failed to update cover image",
        );
      } finally {
        setUploadingCover(false);
        e.target.value = "";
      }
    };

  // =====================================================
  // REMOVE COVER
  // =====================================================

  const handleRemoveCover =
    async () => {
      const confirmed =
        window.confirm(
          "Are you sure you want to remove your cover image?",
        );

      if (!confirmed) {
        return;
      }

      try {
        setRemovingCover(true);
        setProfileError("");
        setProfileSuccess("");

        const response =
          await removeCoverImage(
            accessToken,
          );

        setChannel(
          (prev) => ({
            ...prev,
            ...response.data,
          }),
        );

        setProfileSuccess(
          "Cover image removed successfully.",
        );
      } catch (error) {
        console.error(error);

        setProfileError(
          error.message ||
            "Failed to remove cover image",
        );
      } finally {
        setRemovingCover(false);
      }
    };

  // =====================================================
  // TWEET UPDATED
  // =====================================================

  const handleTweetUpdated =
    (updatedTweet) => {
      setTweets(
        (prev) =>
          prev.map(
            (tweet) =>
              tweet._id ===
              updatedTweet._id
                ? updatedTweet
                : tweet,
          ),
      );
    };

  // =====================================================
  // TWEET DELETED
  // =====================================================

  const handleTweetDeleted =
    (deletedTweetId) => {
      setTweets(
        (prev) =>
          prev.filter(
            (tweet) =>
              tweet._id !==
              deletedTweetId,
          ),
      );
    };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-3 sm:px-6">

        <div className="h-44 animate-pulse rounded-b-3xl bg-[var(--surface-hover)] sm:h-64" />

        <section className="px-1 py-6 sm:px-2">

          <div className="flex items-center gap-4">

            <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-[var(--surface-hover)] sm:h-24 sm:w-24" />

            <div className="space-y-3">
              <div className="h-6 w-40 animate-pulse rounded bg-[var(--surface-hover)] sm:w-48" />

              <div className="h-4 w-28 animate-pulse rounded bg-[var(--surface-hover)] sm:w-32" />
            </div>

          </div>

        </section>

      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">

        <div className="rounded-2xl border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-6 py-4 text-center">

          <p className="text-sm text-[var(--danger)]">
            {error}
          </p>

        </div>

      </main>
    );
  }

  // =====================================================
  // CHANNEL NOT FOUND
  // =====================================================

  if (!channel) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">

        <p className="text-sm text-[var(--text-secondary)]">
          Channel not found.
        </p>

      </main>
    );
  }

  // =====================================================
  // SUBSCRIBTION CHNAGE
  // =====================================================

  const handleSubscriptionChange = (
  newCount,
) => {
  setChannel((prev) => ({
    ...prev,
    subscribersCount: newCount,
  }));
};

  return (
    <main className="mx-auto w-full max-w-6xl">

      {/* =================================================
          COVER IMAGE
      ================================================= */}

      <div className="relative h-44 overflow-hidden rounded-b-3xl bg-[var(--surface-hover)] sm:h-64">

        {channel.coverImage ? (
          <img
            src={channel.coverImage}
            alt={`${channel.userName} cover`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
            No cover image
          </div>
        )}

        {/* Cover actions */}

        {isOwnChannel && (
          <div className="absolute bottom-3 right-3 flex max-w-[calc(100%-1.5rem)] flex-wrap justify-end gap-2 sm:bottom-4 sm:right-4">

            <label className="flex cursor-pointer items-center gap-1.5 rounded-full bg-black/70 px-3 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-black sm:px-4 sm:text-sm">

              <Camera size={15} />

              <span>
                {uploadingCover
                  ? "Uploading..."
                  : "Change cover"}
              </span>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={
                  handleCoverChange
                }
                disabled={
                  uploadingCover
                }
              />

            </label>

            {channel.coverImage && (
              <button
                type="button"
                onClick={
                  handleRemoveCover
                }
                disabled={
                  removingCover
                }
                className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-2 text-xs font-medium text-[var(--danger)] backdrop-blur transition hover:bg-white disabled:opacity-50 sm:px-4 sm:text-sm"
              >

                <Trash2 size={14} />

                <span>
                  {removingCover
                    ? "Removing..."
                    : "Remove"}
                </span>

              </button>
            )}

          </div>
        )}

      </div>

      {/* =================================================
          CHANNEL HEADER
      ================================================= */}

      <section className="border-b border-[var(--border)] px-4 py-6 sm:px-6">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          {/* Avatar */}

          <div className="relative shrink-0 self-start sm:self-auto">

            <img
              src={
                channel.avatar ||
                "/default-avatar.png"
              }
              alt={channel.userName}
              className="h-20 w-20 rounded-full border-4 border-[var(--surface)] object-cover shadow-sm sm:h-24 sm:w-24"
            />

            {isOwnChannel && (
              <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-md transition hover:bg-[var(--accent-hover)]">

                {uploadingAvatar ? (
                  <span className="text-xs">
                    ...
                  </span>
                ) : (
                  <Camera size={15} />
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={
                    handleAvatarChange
                  }
                  disabled={
                    uploadingAvatar
                  }
                />

              </label>
            )}

          </div>

          {/* Channel details */}

          <div className="min-w-0 flex-1">

            <h1 className="truncate text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
              {channel.fullName}
            </h1>

            <p className="mt-1 truncate text-sm text-[var(--text-secondary)]">
              @{channel.userName}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[var(--text-secondary)]">

              <span>
                <strong className="text-[var(--text-primary)]">
                  {channel.subscribersCount ?? 0}
                </strong>{" "}
                subscribers
              </span>

              <span>
                <strong className="text-[var(--text-primary)]">
                  {channel.channelsSubscribedToCount ?? 0}
                </strong>{" "}
                subscriptions
              </span>

            </div>

          </div>

          {/* Actions */}

          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:shrink-0">

            {isOwnChannel ? (
              <>
                <button
                  type="button"
                  onClick={
                    handleOpenEdit
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] sm:flex-none"
                >

                  <Pencil size={15} />

                  Edit profile

                </button>

                {channel.avatar && (
                  <button
                    type="button"
                    onClick={
                      handleRemoveAvatar
                    }
                    disabled={
                      removingAvatar
                    }
                    className="flex items-center justify-center gap-2 rounded-full border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--danger)] transition hover:bg-[var(--danger)]/10 disabled:opacity-50"
                  >

                    <Trash2 size={15} />

                    <span className="hidden sm:inline">
                      {removingAvatar
                        ? "Removing..."
                        : "Remove avatar"}
                    </span>

                  </button>
                )}

              </>
            ) : (
              <div className="w-full sm:w-auto">
                <SubscribeButton
                  channelId={channel._id}
                  onSubscriptionChange={
                    handleSubscriptionChange
                  }
                />
              </div>
            )}

          </div>

        </div>

      </section>

      {/* =================================================
          EDIT PROFILE
      ================================================= */}

      {showEdit &&
        isOwnChannel && (
          <section className="border-b border-[var(--border)] bg-[var(--background)] px-4 py-6 sm:px-6 sm:py-8">

            <div className="mx-auto max-w-2xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-8">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    Edit profile
                  </h2>

                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Update your channel information.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    handleCloseEdit
                  }
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

              </div>

              <form
                onSubmit={
                  handleUpdateProfile
                }
                className="mt-6 space-y-5"
              >

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
                    Full name
                  </label>

                  <input
                    name="fullName"
                    type="text"
                    value={
                      formData.fullName
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="name"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
                    Username
                  </label>

                  <input
                    name="userName"
                    type="text"
                    value={
                      formData.userName
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="username"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
                    required
                  />

                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Changing your username will also change your channel URL.
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="email"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
                    required
                  />
                </div>

                {profileError && (
                  <p className="rounded-xl border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
                    {profileError}
                  </p>
                )}

                {profileSuccess && (
                  <p className="rounded-xl border border-[var(--success)]/20 bg-[var(--success)]/10 px-4 py-3 text-sm text-[var(--success)]">
                    {profileSuccess}
                  </p>
                )}

                <div className="flex flex-col-reverse gap-2 border-t border-[var(--border)] pt-5 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={
                      handleCloseEdit
                    }
                    className="rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      savingProfile
                    }
                    className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingProfile
                      ? "Saving..."
                      : "Save changes"}
                  </button>

                </div>

              </form>

            </div>

          </section>
        )}

      {/* =================================================
          CONTENT TABS
      ================================================= */}

      <section className="px-4 pt-5 sm:px-6">

        <div className="flex border-b border-[var(--border)]">

          <button
            type="button"
            onClick={() =>
              setActiveTab("videos")
            }
            className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition sm:flex-none ${
              activeTab === "videos"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >

            <Video size={17} />

            Videos

            <span className="rounded-full bg-[var(--surface-hover)] px-2 py-0.5 text-xs">
              {videos.length}
            </span>

          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("tweets")
            }
            className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition sm:flex-none ${
              activeTab === "tweets"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >

            <MessageSquare size={17} />

            Tweets

            <span className="rounded-full bg-[var(--surface-hover)] px-2 py-0.5 text-xs">
              {tweets.length}
            </span>

          </button>

        </div>

        {/* =================================================
            VIDEOS TAB
        ================================================= */}

        {activeTab === "videos" && (
          <div className="py-6">

            {/* Videos heading + upload button */}

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Videos
                </h2>

                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {videos.length}{" "}
                  {videos.length === 1
                    ? "video"
                    : "videos"}
                </p>
              </div>

              {isOwnChannel &&
                !videosLoading &&
                !videosError &&
                videos.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowUploadVideo(
                        (prev) => !prev,
                      )
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-red-400 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] sm:w-auto"
                  >

                    {showUploadVideo ? (
                      <X size={17} />
                    ) : (
                      <Video size={17} />
                    )}

                    {showUploadVideo
                      ? "Cancel upload"
                      : "Upload New video"}

                  </button>
                )}

            </div>

            {/* Loading */}

            {videosLoading && (
              <div className="flex justify-center py-16">

                <p className="text-sm text-[var(--text-secondary)]">
                  Loading videos...
                </p>

              </div>
            )}

            {/* Error */}

            {!videosLoading &&
              videosError && (
                <div className="rounded-2xl border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-4 py-8 text-center">

                  <p className="text-sm text-[var(--danger)]">
                    {videosError}
                  </p>

                </div>
              )}

            {/* =================================================
                UPLOAD VIDEO
            ================================================= */}

            {!videosLoading &&
              !videosError &&
              isOwnChannel &&
              (videos.length === 0 ||
                showUploadVideo) && (
                <div className="mb-6 w-full">

                  <UploadVideo
                    accessToken={
                      accessToken
                    }
                    onUploadSuccess={
                      handleVideoUploaded
                    }
                  />

                </div>
              )}

            {/* =================================================
                EMPTY STATE — OTHER CHANNEL
            ================================================= */}

            {!videosLoading &&
              !videosError &&
              videos.length === 0 &&
              !isOwnChannel && (
                <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-14 text-center sm:px-6 sm:py-16">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Video size={26} />
                  </div>

                  <h2 className="mt-5 font-semibold text-[var(--text-primary)]">
                    No videos yet
                  </h2>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
                    This channel hasn't uploaded any videos yet.
                  </p>

                </div>
              )}

            {/* =================================================
                VIDEO GRID
            ================================================= */}

            {!videosLoading &&
              !videosError &&
              videos.length > 0 && (
                <div className="min-w-0">

                  <VideoGrid
                    videos={videos}
                  />

                </div>
              )}

          </div>
        )}

        {/* =================================================
            TWEETS TAB
        ================================================= */}

        {activeTab === "tweets" && (
          <div className="py-6">

            <div className="mx-auto w-full max-w-3xl">

              {/* Tweets loading */}

              {tweetsLoading && (
                <div className="space-y-4">

                  <div className="h-36 animate-pulse rounded-2xl bg-[var(--surface-hover)]" />

                  <div className="h-36 animate-pulse rounded-2xl bg-[var(--surface-hover)]" />

                </div>
              )}

              {/* Tweets error */}

              {!tweetsLoading &&
                tweetsError && (
                  <div className="rounded-2xl border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-4 py-8 text-center">

                    <p className="text-sm text-[var(--danger)]">
                      {tweetsError}
                    </p>

                  </div>
                )}

              {/* No tweets */}

              {!tweetsLoading &&
                !tweetsError &&
                tweets.length === 0 && (
                  <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-14 text-center sm:px-6 sm:py-16">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">

                      <MessageSquare
                        size={26}
                      />

                    </div>

                    <h2 className="mt-5 font-semibold text-[var(--text-primary)]">
                      No tweets yet
                    </h2>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
                      {isOwnChannel
                        ? "Share your first thought with your audience."
                        : "This channel hasn't posted any tweets yet."}
                    </p>

                  </div>
                )}

              {/* Tweets */}

              {!tweetsLoading &&
                !tweetsError &&
                tweets.length > 0 && (
                  <div className="space-y-4">

                    {tweets.map(
                      (tweet) => (
                        <TweetCard
                          key={
                            tweet._id
                          }
                          tweet={
                            tweet
                          }
                          onTweetUpdated={
                            isOwnChannel
                              ? handleTweetUpdated
                              : undefined
                          }
                          onTweetDeleted={
                            isOwnChannel
                              ? handleTweetDeleted
                              : undefined
                          }
                        />
                      ),
                    )}

                  </div>
                )}

            </div>

          </div>
        )}

      </section>

    </main>
  );
}

export default Channel;