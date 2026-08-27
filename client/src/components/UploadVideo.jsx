import { useState } from "react";
import {
  Upload,
  Video,
  Image,
  CheckCircle2,
  AlertCircle,
  FileVideo,
  ImagePlus,
} from "lucide-react";
import { publishVideo } from "../api/video.api.js";

function UploadVideo({
  accessToken,
  onUploadSuccess,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==============================
  // HANDLE TEXT INPUT
  // ==============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // HANDLE VIDEO
  // ==============================

  const handleVideoChange = (e) => {
    setVideoFile(
      e.target.files?.[0] || null,
    );
  };

  // ==============================
  // HANDLE THUMBNAIL
  // ==============================

  const handleThumbnailChange = (e) => {
    setThumbnail(
      e.target.files?.[0] || null,
    );
  };

  // ==============================
  // SUBMIT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!videoFile) {
      setError("Please select a video.");
      return;
    }

    if (!thumbnail) {
      setError("Please select a thumbnail.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append(
        "title",
        formData.title,
      );

      data.append(
        "description",
        formData.description,
      );

      data.append(
        "videoFile",
        videoFile,
      );

      data.append(
        "thumbnail",
        thumbnail,
      );

      await publishVideo(
        data,
        accessToken,
      );

      setSuccess(
        "Video uploaded successfully.",
      );

      setFormData({
        title: "",
        description: "",
      });

      setVideoFile(null);
      setThumbnail(null);

      e.target.reset();

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to upload video.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-3xl">

      {/* =====================================================
          CARD
      ===================================================== */}

      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="border-b border-[var(--border)] p-6 sm:p-8">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <Upload size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
                Upload a video
              </h2>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Share something new with your
                audience.
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            FORM
        =================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6 sm:p-8"
        >

          {/* =================================================
              TITLE
          ================================================= */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
              Video title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Give your video a title"
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
              required
            />
          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-[var(--text-primary)]">
                Description
              </label>

              <span className="text-xs text-[var(--text-muted)]">
                {formData.description.length}
                /2000
              </span>
            </div>

            <textarea
              name="description"
              value={
                formData.description
              }
              onChange={handleChange}
              maxLength={2000}
              placeholder="Tell viewers what your video is about..."
              rows={6}
              className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-6 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
              required
            />
          </div>

          {/* =================================================
              FILE UPLOADS
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-2">

            {/* VIDEO */}

            <label className="group cursor-pointer">

              <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background)] p-6 text-center transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-hover)] text-[var(--accent)] transition group-hover:scale-105">
                  {videoFile ? (
                    <FileVideo size={22} />
                  ) : (
                    <Video size={22} />
                  )}
                </div>

                <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">
                  {videoFile
                    ? "Video selected"
                    : "Select your video"}
                </p>

                <p className="mt-1 max-w-[220px] truncate text-xs text-[var(--text-muted)]">
                  {videoFile
                    ? videoFile.name
                    : "MP4, WebM or other video formats"}
                </p>

                <span className="mt-4 rounded-full bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                  Choose file
                </span>
              </div>

              <input
                type="file"
                accept="video/*"
                onChange={
                  handleVideoChange
                }
                className="hidden"
                required
              />
            </label>

            {/* THUMBNAIL */}

            <label className="group cursor-pointer">

              <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background)] p-6 text-center transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-hover)] text-[var(--accent)] transition group-hover:scale-105">
                  {thumbnail ? (
                    <ImagePlus size={22} />
                  ) : (
                    <Image size={22} />
                  )}
                </div>

                <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">
                  {thumbnail
                    ? "Thumbnail selected"
                    : "Select thumbnail"}
                </p>

                <p className="mt-1 max-w-[220px] truncate text-xs text-[var(--text-muted)]">
                  {thumbnail
                    ? thumbnail.name
                    : "JPG, PNG or WebP"}
                </p>

                <span className="mt-4 rounded-full bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                  Choose file
                </span>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleThumbnailChange
                }
                className="hidden"
                required
              />
            </label>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-4 py-3">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0 text-[var(--danger)]"
              />

              <p className="text-sm text-[var(--danger)]">
                {error}
              </p>
            </div>
          )}

          {/* =================================================
              SUCCESS
          ================================================= */}

          {success && (
            <div className="flex items-start gap-3 rounded-2xl border border-[var(--success)]/20 bg-[var(--success)]/10 px-4 py-3">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-[var(--success)]"
              />

              <p className="text-sm text-[var(--success)]">
                {success}
              </p>
            </div>
          )}

          {/* =================================================
              SUBMIT
          ================================================= */}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                Uploading video...
              </>
            ) : (
              <>
                <Upload size={17} />

                Upload video
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadVideo;