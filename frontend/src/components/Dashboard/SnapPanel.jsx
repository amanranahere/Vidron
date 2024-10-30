import React, { useState } from "react";
import { GoSearch } from "react-icons/go";
import SnapCard from "./SnapCard.jsx";

function SnapPanel({ channelSnaps }) {
  const [filter, setFilter] = useState(channelSnaps || []);
  const [input, setInput] = useState("");

  function handleUserInput(input) {
    setInput(input);
    if (!input) {
      setFilter(channelSnaps);
    } else {
      const filteredData = channelSnaps?.filter((snap) =>
        snap.title.toLowerCase().includes(input.toLowerCase().trim())
      );
      setFilter(filteredData);
    }
  }

  if (!channelSnaps || channelSnaps.length === 0) {
    return <p>No snaps available.</p>;
  }

  let snaps = filter || channelSnaps;

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
              <th className="border-collapse border-b p-4">Snap</th>
              <th className="border-collapse border-b p-4">Date Uploaded</th>
              <th className="border-collapse border-b p-4">Views</th>
              <th className="border-collapse border-b p-4">Comments</th>
              <th className="border-collapse border-b p-4">Likes</th>
              <th className="border-collapse border-b p-4">Options</th>
            </tr>
          </thead>

          <tbody>
            {snaps?.map((snap) => (
              <SnapCard key={snap._id} snap={snap} />
            ))}

            {snaps?.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  No snaps found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default SnapPanel;
