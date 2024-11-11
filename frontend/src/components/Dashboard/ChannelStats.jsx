import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { GoDeviceCameraVideo } from "react-icons/go";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegUser, FaRegHeart, FaPlayCircle } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import VideoForm from "./VideoForm.jsx";
import SnapForm from "./SnapForm.jsx";
import InfoBox from "./InfoBox.jsx";

function ChannelStats({ stats }) {
  const user = useSelector((state) => state.auth.userData);
  const uploadRef = useRef();
  const snapUploadRef = useRef();

  return (
    <>
      <div className="flex flex-wrap justify-between gap-4">
        <div className="block">
          <h1 className="text-2xl font-bold">Welcome Back, {user?.fullname}</h1>
          <p className="text-sm text-gray-300">
            Track and manage your channel, videos and snaps.
          </p>
        </div>

        <div className="block">
          <VideoForm ref={uploadRef} />
          <button
            onClick={() => uploadRef.current?.open()}
            className="mt-4 inline-flex items-center gap-x-2 bg-pink-600 hover:bg-pink-600/90 border border-transparent rounded hover:border-white px-3 py-1.5 font-semibold text-white"
          >
            <IoAdd className="w-5 h-5" />
            Upload Video
          </button>
        </div>

        <div className="block">
          <SnapForm ref={snapUploadRef} />
          <button
            onClick={() => snapUploadRef.current?.open()}
            className="mt-4 inline-flex items-center gap-x-2 bg-pink-600 hover:bg-pink-600/90 border border-transparent rounded hover:border-white px-3 py-1.5 font-semibold text-white"
          >
            <IoAdd className="w-5 h-5" />
            Upload Snap
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))] gap-4">
        <InfoBox
          key="total-videos"
          title="Total Videos"
          value={stats.videos}
          icon={<GoDeviceCameraVideo className="h-6 w-6" />}
        />

        <InfoBox
          key="total-snaps"
          title="Total Snaps"
          value={stats.snaps}
          icon={<FaPlayCircle className="h-6 w-6" />}
        />

        <InfoBox
          key="total-tweets"
          title="Total Tweets"
          value={stats.tweets}
          icon={<FaPlayCircle className="h-6 w-6" />}
        />

        <InfoBox
          key="total-views"
          title="Total Views"
          value={stats.views > 0 ? stats.views : 0}
          icon={<MdOutlineRemoveRedEye className="h-6 w-6" />}
        />

        <InfoBox
          key="total-subscribers"
          title="Total Subscribers"
          value={stats.subscribers > 0 ? stats.subscribers : 0}
          icon={<FaRegUser className="h-6 w-6" />}
        />

        <InfoBox
          key="total-likes"
          title="Total Likes"
          value={stats.likes > 0 ? stats.likes : 0}
          icon={<FaRegHeart className="h-6 w-6" />}
        />
      </div>
    </>
  );
}

export default ChannelStats;
