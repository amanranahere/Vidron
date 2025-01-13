import React, { useState } from "react";
import { GoSearch } from "react-icons/go";
import VideoTable from "./VideoTable.jsx";
import { IoClose } from "react-icons/io5";

function VideoPanel({ channelVideos, setIsVideoPanel }) {
  const [filter, setFilter] = useState(channelVideos || []);
  const [input, setInput] = useState("");

  function handleUserInput(input) {
    setInput(input);
    if (!input) {
      setFilter(channelVideos);
    } else {
      const filteredData = channelVideos?.filter((video) =>
        video.title.toLowerCase().includes(input.toLowerCase().trim())
      );
      setFilter(filteredData);
    }
  }

  if (!channelVideos || channelVideos.length === 0) {
    return <p>No videos available.</p>;
  }

  let videos = filter || channelVideos;

  return (
    <div className="fixed z-50 inset-0 backdrop-blur-md flex flex-col items-center justify-center overflow-auto scrollbar-thin scrollbar-thumb-[#2a2a2a] scrollbar-track-transparent">
      {/* close button */}
      <button
        type="button"
        onClick={() => setIsVideoPanel(false)}
        className="absolute right-2 top-0 md:right-4 md:top-4 lg:right-10 lg:top-10 h-7 w-7 focus:border-dotted z-50"
      >
        <IoClose className="w-9 h-9" />
      </button>

      <div className="max-w-max max-h-[90%] slide-up ">
        {/* search bar */}
        <div className="relative w-full py-4 px-14 rounded-t-[20px] bg-[#3a3a3a]  overflow-hidden">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
            <GoSearch />
          </span>

          <input
            autoFocus
            onChange={(e) => handleUserInput(e.target.value.trim())}
            className="w-full bg-transparent outline-none"
            placeholder="Search by entering video title"
          />
        </div>

        {/* table */}
        <div className="w-full bg-[#1a1a1a] rounded-b-[20px]">
          <table className="min-w-min rounded-b-[20px] text-white">
            <thead>
              <tr>
                <th className="border-collapse border-b p-4">Toggle</th>
                <th className="border-collapse border-b p-4">Status</th>
                <th className="border-collapse border-b p-4">Video</th>
                <th className="border-collapse border-b p-4 hidden md:table-cell">
                  Date Uploaded
                </th>
                <th className="border-collapse border-b p-4 hidden md:table-cell">
                  Views
                </th>
                <th className="border-collapse border-b p-4 hidden md:table-cell">
                  Likes
                </th>
                <th className="border-collapse border-b p-4">Options</th>
              </tr>
            </thead>

            <tbody>
              {videos?.map((video) => (
                <VideoTable key={video._id} video={video} />
              ))}

              {videos?.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center p-10">
                    No videos found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VideoPanel;
