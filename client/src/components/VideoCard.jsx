import { useNavigate } from "react-router-dom";

function VideoCard({ video }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/watch/${video._id}`);
  };

  return (
    <article
      onClick={handleClick}
      className="group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-200">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Video information */}
      <div className="mt-3">
        <h2 className="line-clamp-2 text-base font-semibold leading-6 text-gray-900">
          {video.title}
        </h2>

        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
          {video.description}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          {video.views} views
        </p>
      </div>
    </article>
  );
}

export default VideoCard;