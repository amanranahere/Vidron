import React from "react";
import { Link, useNavigate } from "react-router-dom";
import getTimeDistanceToNow from "../../utils/getTimeDistance.js";
import { addUserVideoHistory } from "../../store/userSlice.js";
import { useDispatch } from "react-redux";
import axiosInstance from "../../utils/axios.helper.js";

function VideoListCard({ video }) {
  const formattedDuration = video?.duration;
  const timeDistance = getTimeDistanceToNow(video?.createdAt);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const updateWatchHistory = async (video) => {
    try {
      const response = await axiosInstance.post(
        `/users/watch-history/video/${video._id}`
      );
      if (response?.data?.data) {
        dispatch(addUserVideoHistory([video._id]));
      }
    } catch (error) {
      console.error("Failed to update watch history", error);
    }
  };

  const updateViewCount = async (video) => {
    try {
      await axiosInstance.patch(`/videos/views/${video._id}`);
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const handleVideoClick = () => {
    updateWatchHistory(video);
    updateViewCount(video);
  };

  const handleChannelClick = (e) => {
    e.preventDefault();
    navigate(`/channel/${video?.owner?.username}`);
  };

  return (
    <div className="w-full">
      <Link to={`/video-watchpage/${video?._id}`} onClick={handleVideoClick}>
        <div className="pb-3 hover:bg-zinc-900 md:rounded-lg">
          <div className="text-white flex flex-col md:flex-row">
            <div className="relative lg:flex-shrink-0">
              <img
                className="w-full max-w-full h-auto md:w-[40vw] md:h-[25vw] lg:w-[13vw] lg:h-[8vw] object-cover md:rounded-xl"
                src={video?.thumbnail}
                alt={video?.title}
              />

              <p className="absolute bottom-1 right-3">{formattedDuration}</p>
            </div>

            <div className="flex my-4 md:my-0">
              <div
                onClick={handleChannelClick}
                className="md:hidden min-w-9 min-h-9 ml-3 mt-1"
              >
                <img
                  className={`w-9 h-9 rounded-full object-cover`}
                  src={`${video?.owner?.avatar}`}
                  alt={video?.owner?.fullName}
                />
              </div>

              <div className="mx-3 lg:mx-2">
                <h1
                  title={video?.title}
                  className="md:text-lg lg:text-base line-clamp-2 md:line-clamp-3 lg:line-clamp-2"
                >
                  {`${video?.title}`}
                </h1>

                <div className="w-full flex flex-row md:flex-col">
                  <div
                    onClick={handleChannelClick}
                    className="flex items-center md:text-[1rem] lg:text-[0.85rem]"
                  >
                    <p className="text-gray-400">{video?.owner?.fullname}</p>
                  </div>

                  <div className="flex">
                    <p className="ml-2 md:ml-0 text-gray-400 md:text-[1rem] lg:text-[0.85rem] line-clamp-1">{`${video?.views} views • ${timeDistance}`}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default VideoListCard;
