import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import formatDate from "../../utils/formatDate.js";
import ConfirmPopup from "../ConfirmPopup.jsx";
import axiosInstance from "../../utils/axios.helper.js";
import { updateSnapPublishedStatus } from "../../store/dashboardSlice.js";
import { deleteSnap } from "../../store/dashboardSlice.js";
import { getChannelStats } from "../../hooks/getChannelStats.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { MdDelete, MdEdit } from "react-icons/md";
import SnapForm from "./SnapForm.jsx";

function SnapCard({ snap }) {
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
    <tr key={snap._id} className="group border">
      <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
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

            <span className="inline-block h-6 w-full rounded-2xl bg-gray-200 duration-200 after:absolute after:bottom-1 after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-black after:duration-200 peer-checked:bg-pink-600 peer-checked:after:left-7"></span>
          </label>
        </div>
      </td>

      <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
        <div className="flex justify-center">
          <span
            className={`inline-block rounded-2xl border px-1.5 py-0.5 ${
              publishStatus
                ? "border-green-600 text-green-600"
                : "border-orange-600 text-orange-600"
            }`}
          >
            {publishStatus ? "Published" : "Unpublished"}
          </span>
        </div>
      </td>

      <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
        <div className="flex justify-start items-center gap-4">
          {publishStatus ? (
            <Link to={`/watchpage/${snap._id}`}>
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={snap.thumbnail}
                alt={snap.title}
              />
            </Link>
          ) : (
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={snap.thumbnail}
              alt={snap.title}
            />
          )}

          <h3 className="font-semibold">
            {publishStatus ? (
              <Link
                to={`/watchpage/${snap._id}`}
                className="hover:text-gray-300"
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

      <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
        {formatDate(snap.createdAt)}
      </td>

      <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
        {snap.views}
      </td>

      <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
        {snap.commentsCount}
      </td>

      <td className="border-collapse text-center border-b border-gray-600 px-4 py-3 group-last:border-none">
        {snap.likesCount}
      </td>

      <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
        <ConfirmPopup
          ref={confirmDialog}
          title="Delete Snap"
          subtitle={`${snap.title} - Total views: ${snap.views}`}
          confirm="Delete"
          cancel="Cancel"
          critical
          message="Are you sure you want to delete this snap? Once deleted, you will not be able to recover it."
          actionFunction={handleDeleteSnap}
        />

        <SnapForm ref={editDialog} snap={snap} />

        <div className="flex justify-center gap-4">
          <button
            onClick={() => confirmDialog.current.open()}
            title="Delete snap"
          >
            <MdDelete className="h-5 w-5 hover:text-red-500" />
          </button>

          <button onClick={() => editDialog.current?.open()} title="Edit snap">
            <MdEdit className="h-5 w-5 hover:text-red-500" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default SnapCard;
