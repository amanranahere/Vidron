import React, { useState } from "react";
import { GoSearch } from "react-icons/go";
import VideoCard from "./VideoCard.jsx";

function VideoPanel({ channelVideos }) {
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
    <>
      <div className="relative w-full mb-2 rounded-full bg-zinc-800 border py-1 pl-8 pr-3 overflow-hidden">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
          <GoSearch />
        </span>

        <input
          onChange={(e) => handleUserInput(e.target.value.trim())}
          className="w-full bg-transparent outline-none"
          placeholder="Search"
        />
      </div>

      <div className="w-full overflow-auto">
        <table className="w-full min-w-[1000px] border-collapse border text-white">
          <thead>
            <tr>
              <th className="border-collapse border-b p-4">Toggle</th>
              <th className="border-collapse border-b p-4">Status</th>
              <th className="border-collapse border-b p-4">Video</th>
              <th className="border-collapse border-b p-4">Date Uploaded</th>
              <th className="border-collapse border-b p-4">Views</th>
              <th className="border-collapse border-b p-4">Likes</th>
              <th className="border-collapse border-b p-4">Options</th>
            </tr>
          </thead>

          <tbody>
            {videos?.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}

            {videos?.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  No videos found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default VideoPanel;
