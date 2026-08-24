import { useNavigate } from "react-router-dom";

function VideoCard({ video }) {

    const navigate = useNavigate();
    const handleClick = () => {
    navigate(`/watch/${video._id}`);
     };
    
    
  return (
     <article
      className="video-card"
      onClick={handleClick}
    >
      <div className="video-card__thumbnail">
        <img
          src={video.thumbnail}
          alt={video.title}
        />
      </div>

      <div className="video-card__info">
        <h2 className="video-card__title">
          {video.title}
        </h2>

        <p className="video-card__description">
          {video.description}
        </p>

        <p className="video-card__views">
          {video.views} views
        </p>
      </div>
    </article>
  );
}

export default VideoCard;