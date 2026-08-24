function VideoCard({ video }) {
  return (
    <article className="video-card">
      <div className="video-card__thumbnail">
        <video
          controls
          muted
          poster={video.thumbnail}
        >
          <source
            src={video.videoFile}
            type="video/mp4"
          />

          Your browser does not support the video tag.
        </video>
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