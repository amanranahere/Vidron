import React from "react";
import { Link, useNavigate } from "react-router-dom";
import getTimeDistanceToNow from "../../utils/getTimeDistance.js";
import { useDispatch } from "react-redux";
import { addUserSnapHistory } from "../../store/userSlice.js";
import axiosInstance from "../../utils/axios.helper.js";

function SnapCard({ snap, name = true }) {
  const formattedDuration = snap?.duration;
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
    <Link to={`/snap-watchpage/${snap?._id}`} onClick={handleSnapClick}>
      <div
        key={snap._id}
        className="rounded-xl mt-2 text-white p-1 hover:bg-zinc-900"
      >
        <div className="relative w-full pt-[60%]">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover mb-2 rounded-xl border border-gray-800"
              src={snap?.snapThumbnail}
              alt={snap?.title}
            />
          </div>

          <p className="absolute bottom-1 right-3 ">{formattedDuration}</p>
        </div>

        <div className="flex mt-1">
          <div onClick={handleChannelClick} className="mt-1 flex-shrink-0">
            <img
              className="w-9 h-9 bg-gray-100 rounded-full object-cover"
              src={snap?.owner?.avatar}
              alt={snap?.owner?.fullname}
            />
          </div>

          <div className="ml-4">
            <h2
              className="text-lg font-semibold line-clamp-2"
              title={snap?.title}
            >
              {snap?.title}
            </h2>

            {name && <h2 className="text-gray-200">{snap?.owner?.fullname}</h2>}

            <p className="text-gray-300 text-[0.95rem]">{`${snap?.views} views • ${timeDistance}`}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SnapCard;
