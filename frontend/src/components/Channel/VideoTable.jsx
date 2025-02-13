import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import formatDate from "../../utils/formatDate.js";
import ConfirmPopup from "../ConfirmPopup.jsx";
import axiosInstance from "../../utils/axios.helper.js";
import { updateVideoPublishedStatus } from "../../store/metricsSlice.js";
import { deleteVideo } from "../../store/metricsSlice.js";
import getChannelStats from "../../hooks/getChannelStats.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { MdDelete, MdEdit } from "react-icons/md";
import VideoForm from "./VideoForm.jsx";

function VideoTable({ video }) {
  const dispatch = useDispatch();
  const confirmDialog = useRef();
  const editDialog = useRef();
  const user = useSelector((state) => state.auth.userData);

  const [publishStatus, setPublishStatus] = useState(video?.isPublished);

  const handleTogglePublish = async () => {
    try {
      const response = await axiosInstance.patch(
        `/videos/toggle/publish/${video._id}`
      );

      if (response.data.success) {
        dispatch(
          updateVideoPublishedStatus({
            videoId: video._id,
            isPublished: !video.isPublished,
          })
        );
        toast.success(response.data.message);
        setPublishStatus((prev) => !prev);
      }
    } catch (error) {
      toast.error("Error while toggling publish status");
      console.log(error);
    }
  };

  const handleDeleteVideo = async (isConfirm) => {
    if (isConfirm) {
      try {
        const response = await axiosInstance.delete(`/videos/${video._id}`);
        if (response.data.success) {
          toast.success(response.data.message);
          dispatch(deleteVideo({ video: video._id }));
          getChannelStats(dispatch, user._id);
        }
      } catch (error) {
        toast.error("Error while deleting video");
        console.log(error);
      }
    }
  };

  return (
    <tr key={video._id} className="group">
      <td className="border-collapse border-b border-gray-600 md:px-4 py-3 group-last:border-none">
        <div className="flex justify-center">
          <label
            htmlFor={"vid" + video._id}
            className="relative inline-block w-12 cursor-pointer overflow-hidden"
          >
            <input
              type="checkbox"
              onClick={handleTogglePublish}
              id={"vid" + video._id}
              defaultChecked={video.isPublished}
              className="peer sr-only"
            />

            <span className="inline-block h-6 w-full rounded-2xl bg-gray-200 duration-200 after:absolute after:bottom-1 after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-black after:duration-200 peer-checked:bg-[#7a7a7a] peer-checked:after:left-7"></span>
          </label>
        </div>
      </td>

      <td className="border-collapse border-b border-gray-600 md:px-4 py-3 group-last:border-none">
        <div className="flex justify-center">
          <span
            className={`inline-block px-1.5 py-0.5 ${
              publishStatus ? "text-green-400" : "text-red-400"
            }`}
          >
            {publishStatus ? "Published" : "Unpublished"}
          </span>
        </div>
      </td>

      <td className="border-collapse border-b border-gray-600 md:px-4 py-3 group-last:border-none">
        <div className="flex justify-start items-center gap-4">
          {publishStatus ? (
            <Link to={`/video-watchpage/${video._id}`}>
              <img
                className="h-8 w-12 rounded-sm object-cover hidden md:block"
                src={video.thumbnail}
                alt={video.title}
              />
            </Link>
          ) : (
            <img
              className="h-8 w-12 rounded-sm object-cover hidden md:block"
              src={video.thumbnail}
              alt={video.title}
            />
          )}

          <h3 className="font-semibold">
            {publishStatus ? (
              <Link
                to={`/video-watchpage/${video._id}`}
                className="hover:text-gray-300 line-clamp-2"
              >
                {video.title?.length > 35
                  ? video.title.substr(0, 35) + "..."
                  : video.title}
              </Link>
            ) : video.title?.length > 35 ? (
              video.title.substr(0, 35) + "..."
            ) : (
              video.title
            )}
          </h3>
        </div>
      </td>

      <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none hidden md:table-cell">
        {formatDate(video.createdAt)}
      </td>

      <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none hidden md:table-cell">
        {video.views}
      </td>

      <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none hidden md:table-cell">
        {video.likesCount}
      </td>

      <td className="border-collapse border-b border-gray-600 md:px-4 py-3 group-last:border-none">
        <ConfirmPopup
          ref={confirmDialog}
          title="Delete Video"
          subtitle={
            <div className="text-gray-100">
              <span className="text-white">Title:</span>{" "}
              <span className="italic text-cyan-400">{video.title}</span>
            </div>
          }
          confirm="Delete"
          cancel="Cancel"
          critical
          message="Are you sure you want to delete this video? Once deleted, you will not be able to recover it."
          actionFunction={handleDeleteVideo}
        />

        <VideoForm ref={editDialog} video={video} />

        <div className="flex justify-center gap-4">
          <button onClick={() => editDialog.current?.open()} title="Edit Video">
            <MdEdit className="h-6 w-6 hover:text-green-400" />
          </button>

          <button
            onClick={() => confirmDialog.current.open()}
            title="Delete Video"
          >
            <MdDelete className="h-6 w-6 hover:text-red-400" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default VideoTable;
