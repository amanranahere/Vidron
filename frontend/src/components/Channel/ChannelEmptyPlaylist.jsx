import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { RiPlayList2Fill } from "react-icons/ri";
import PlaylistForm from "../Playlist/PlaylistForm.jsx";

function ChannelEmptyPlaylist({ videos = false }) {
  const { status, userData } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user.user);
  const dialog = useRef();

  const playlistPopup = () => {
    dialog.current.open();
  };

  if (status && user.username === userData.username) {
    return (
      <div className="flex justify-center p-4">
        <div className="w-full max-w-sm text-center mt-6">
          <p className="mb-3 w-full">
            <span className="inline-flex rounded-full bg-[#3a3a3a] p-3">
              <RiPlayList2Fill className="w-6 h-6" />
            </span>
          </p>

          <h5 className="mb-2 font-semibold text-lg4">
            {videos ? "Empty Playlist" : "No playlist created"}
          </h5>

          <p className="text-gray-200">
            {videos
              ? "This Playlist has no videos."
              : "Your channel has yet to create a playlist. Click to create a new playlist"}
          </p>

          <PlaylistForm ref={dialog} />

          {!videos && (
            <button
              onClick={playlistPopup}
              className="mt-4 inline-flex items-center gap-x-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] active:scale-95 rounded-lg px-3 py-1.5 font-semibold "
            >
              New Playlist
            </button>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center p-4">
        <div className="w-full max-w-sm text-center mt-6">
          <p className="mb-3 w-full">
            <span className="inline-flex rounded-full bg-[#3a3a3a] p-3">
              <RiPlayList2Fill className="w-6 h-6" />
            </span>
          </p>

          <h5 className="mb-2 font-semibold text-lg">
            {videos ? "Empty Playlist" : "No playlist created"}
          </h5>

          <p className="text-gray-200">
            {videos
              ? "This Playlist has no videos."
              : "There are no playlist created on this channel."}
          </p>
        </div>
      </div>
    );
  }
}

export default ChannelEmptyPlaylist;
