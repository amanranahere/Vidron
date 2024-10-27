import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoPlayOutline, IoAdd } from "react-icons/io5";

function ChannelEmptySnap() {
  const { status, userData } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const isOwner = status && user.username === userData.username;

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-sm text-center mt-6">
        <p className="mb-3 w-full">
          <span className="inline-flex rounded-full bg-pink-500 p-2">
            <IoPlayOutline className="w-6 h-6" />
          </span>
        </p>

        <h5 className="mb-2 font-semibold">No snaps uploaded</h5>

        <p>
          {isOwner
            ? "You have yet to upload a snap. Click to upload a new snap."
            : "This page has yet to upload a snap. Search another page to find more snaps."}
        </p>

        {isOwner && (
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="mt-4 inline-flex items-center gap-x-2 bg-pink-500 hover:bg-pink-500/90 border border-transparent rounded-lg hover:border-white px-3 py-1.5 font-semibold text-black"
          >
            <IoAdd className="w-5 h-5" />
            New Snap
          </button>
        )}
      </div>
    </div>
  );
}

export default ChannelEmptySnap;
