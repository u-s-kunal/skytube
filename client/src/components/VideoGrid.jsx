import VideoCard from "./VideoCard.jsx";

function VideoGrid({ videos }) {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-x-5
        gap-y-10
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        2xl:grid-cols-5
      "
    >
      {videos.map((video) => (
        <VideoCard
          key={video._id}
          video={video}
        />
      ))}
    </div>
  );
}

export default VideoGrid;