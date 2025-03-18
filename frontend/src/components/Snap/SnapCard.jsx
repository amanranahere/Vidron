import React from "react";
import { Link, useNavigate } from "react-router-dom";
import getTimeDistanceToNow from "../../utils/getTimeDistance.js";
import { useDispatch } from "react-redux";
import { addUserSnapHistory } from "../../store/userSlice.js";
import axiosInstance from "../../utils/axios.helper.js";

function SnapCard({ snap, width = "100%" }) {
  // const formattedDuration = snap?.duration;
  const timeDistance = getTimeDistanceToNow(snap?.createdAt);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const updateWatchHistory = async (snap) => {
    try {
      const response = await axiosInstance.post(
        `/users/watch-history/snap/${snap._id}`
      );
      if (response?.data?.data) {
        dispatch(addUserSnapHistory([snap._id]));
      }
    } catch (error) {
      console.error("Failed to update watch history", error);
    }
  };

  const updateViewCount = async (video) => {
    try {
      await axiosInstance.patch(`/snaps/views/${snap._id}`);
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const handleSnapClick = () => {
    updateWatchHistory(snap);
    updateViewCount(snap);
  };

  const handleChannelClick = (e) => {
    e.preventDefault();
    navigate(`/channel/${snap?.owner?.username}`);
  };

  return (
    <Link
      to={`/snap-watchpage/${snap?._id}`}
      onClick={handleSnapClick}
      className=""
    >
      <div key={snap._id} className="rounded-xl text-white" style={{ width }}>
        <div className="relative aspect-[9/16] rounded-xl border border-gray-800 overflow-hidden group">
          <div className="absolute hidden group-hover:block inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <img
            className="w-full h-full object-cover"
            src={snap?.snapThumbnail}
            alt={snap?.title}
          />

          <div className="absolute bottom-2 left-0 flex">
            <div className="ml-2">
              <h2
                className="text-sm md:text-lg font-semibold line-clamp-2 "
                title={snap?.title}
              >
                {snap?.title}
              </h2>

              <p className="text-gray-300 text-[0.5rem] md:text-[0.95rem]">{`${snap?.views} views • ${timeDistance}`}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SnapCard;
