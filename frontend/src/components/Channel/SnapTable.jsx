import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import formatDate from "../../utils/formatDate.js";
import ConfirmPopup from "../ConfirmPopup.jsx";
import axiosInstance from "../../utils/axios.helper.js";
import { updateSnapPublishedStatus } from "../../store/metricsSlice.js";
import { deleteSnap } from "../../store/metricsSlice.js";
import getChannelStats from "../../hooks/getChannelStats.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { MdDelete, MdEdit } from "react-icons/md";
import SnapForm from "./SnapForm.jsx";

function SnapTable({ snap }) {
  const dispatch = useDispatch();
  const confirmDialog = useRef();
  const editDialog = useRef();
  const user = useSelector((state) => state.auth.userData);

  const [publishStatus, setPublishStatus] = useState(snap?.isPublished);

  const handleTogglePublish = async () => {
    try {
      const response = await axiosInstance.patch(
        `/snaps/toggle/publish/${snap._id}`
      );

      if (response.data.success) {
        dispatch(
          updateSnapPublishedStatus({
            snapId: snap._id,
            isPublished: !snap.isPublished,
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

  const handleDeleteSnap = async (isConfirm) => {
    if (isConfirm) {
      try {
        const response = await axiosInstance.delete(`/snaps/${snap._id}`);
        if (response.data.success) {
          toast.success(response.data.message);
          dispatch(deleteSnap({ snap: snap._id }));
          getChannelStats(dispatch, user._id);
        }
      } catch (error) {
        toast.error("Error while deleting snap");
        console.log(error);
      }
    }
  };

  return (
    <tr key={snap._id} className="group">
      <td className="border-collapse border-b border-gray-600 md:px-4 py-3 group-last:border-none">
        <div className="flex justify-center">
          <label
            htmlFor={"sp" + snap._id}
            className="relative inline-block w-12 cursor-pointer overflow-hidden"
          >
            <input
              type="checkbox"
              onClick={handleTogglePublish}
              id={"sp" + snap._id}
              defaultChecked={snap.isPublished}
              className="peer sr-only"
            />

            <span className="inline-block h-6 w-full rounded-2xl bg-gray-200 duration-200 after:absolute after:bottom-1 after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-black after:duration-200  peer-checked:bg-[#7a7a7a] peer-checked:after:left-7"></span>
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
            <Link to={`/snap-watchpage/${snap._id}`}>
              <img
                className="h-8 w-6 rounded-sm object-cover hidden md:block"
                src={snap.snapThumbnail}
                alt={snap.title}
              />
            </Link>
          ) : (
            <img
              className="h-8 w-6 rounded-sm object-cover hidden md:block"
              src={snap.snapThumbnail}
              alt={snap.title}
            />
          )}

          <h3 className="font-semibold">
            {publishStatus ? (
              <Link
                to={`/snap-watchpage/${snap._id}`}
                className="hover:text-gray-300 line-clamp-2"
              >
                {snap.title?.length > 35
                  ? snap.title.substr(0, 35) + "..."
                  : snap.title}
              </Link>
            ) : snap.title?.length > 35 ? (
              snap.title.substr(0, 35) + "..."
            ) : (
              snap.title
            )}
          </h3>
        </div>
      </td>

      <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none hidden md:table-cell">
        {formatDate(snap.createdAt)}
      </td>

      <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none hidden md:table-cell">
        {snap.views}
      </td>

      <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none hidden md:table-cell">
        {snap.likesCount}
      </td>

      <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
        <ConfirmPopup
          ref={confirmDialog}
          title="Delete Snap"
          subtitle={
            <div className="text-gray-100">
              <span className="text-white">Title:</span>{" "}
              <span className="italic text-cyan-400">{snap.title}</span>
            </div>
          }
          confirm="Delete"
          cancel="Cancel"
          critical
          message="Are you sure you want to delete this snap? Once deleted, you will not be able to recover it."
          actionFunction={handleDeleteSnap}
        />

        <SnapForm ref={editDialog} snap={snap} />

        <div className="flex justify-center gap-4">
          <button onClick={() => editDialog.current?.open()} title="Edit Snap">
            <MdEdit className="h-6 w-6 hover:text-green-400" />
          </button>

          <button
            onClick={() => confirmDialog.current.open()}
            title="Delete Snap"
          >
            <MdDelete className="h-6 w-6 hover:text-red-400" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default SnapTable;
