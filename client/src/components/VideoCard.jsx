import { useNavigate } from "react-router-dom";
import { Clock, Eye } from "lucide-react";

function VideoCard({ video }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/watch/${video._id}`);
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds < 0) {
      return null;
    }

    const totalSeconds = Math.floor(seconds);

    const hours = Math.floor(
      totalSeconds / 3600,
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60,
    );

    const remainingSeconds =
      totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(
        2,
        "0",
      )}:${String(remainingSeconds).padStart(
        2,
        "0",
      )}`;
    }

    return `${minutes}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  const duration = formatDuration(
    video.duration,
  );

  return (
    <article
      onClick={handleClick}
      className="group cursor-pointer"
    >
      {/* ==============================
          THUMBNAIL
      ============================== */}

      <div className="relative aspect-video overflow-hidden rounded-2xl bg-[var(--surface)]">

        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
        />

        {/* Gradient */}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

        {/* Duration */}

        {duration && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-md bg-black/75 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Clock size={12} />
            {duration}
          </div>
        )}

        {/* Play indicator */}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow-lg backdrop-blur-sm">
            <span className="ml-0.5 text-lg">
              ▶
            </span>
          </div>
        </div>
      </div>

      {/* ==============================
          VIDEO INFORMATION
      ============================== */}

      <div className="mt-3">

        <h2 className="line-clamp-2 text-[15px] font-semibold leading-5 text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
          {video.title}
        </h2>

        {video.description && (
          <p className="mt-1.5 line-clamp-1 text-sm leading-5 text-[var(--text-secondary)]">
            {video.description}
          </p>
        )}

        {/* Metadata */}

        <div className="mt-2 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Eye size={14} />

          <span>
            {video.views ?? 0} views
          </span>

          {video.createdAt && (
            <>
              <span>·</span>

              <span>
                {new Date(
                  video.createdAt,
                ).toLocaleDateString(
                  undefined,
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                )}
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default VideoCard;