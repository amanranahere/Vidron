import React, { useState } from "react";
import { GoSearch } from "react-icons/go";
import SnapTable from "./SnapTable.jsx";
import { IoClose } from "react-icons/io5";

function SnapPanel({ channelSnaps, setIsSnapPanel }) {
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
    <div className="fixed z-50 inset-0 backdrop-blur-md flex flex-col items-center justify-center overflow-auto scrollbar-thin scrollbar-thumb-[#2a2a2a] scrollbar-track-transparent">
      {/* close button */}
      <button
        type="button"
        onClick={() => setIsSnapPanel(false)}
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
            onChange={(e) => handleUserInput(e.target.value.trim())}
            className="w-full bg-transparent outline-none"
            placeholder="Search by entering snap title"
          />
        </div>

        {/* table */}
        <div className="w-full bg-[#1a1a1a] rounded-b-[20px]">
          <table className="min-w-min rounded-b-[20px] text-white">
            <thead>
              <tr>
                <th className="border-collapse border-b p-4">Toggle</th>
                <th className="border-collapse border-b p-4">Status</th>
                <th className="border-collapse border-b p-4">Snap</th>
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
              {snaps?.map((snap) => (
                <SnapTable key={snap._id} snap={snap} />
              ))}

              {snaps?.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center p-10">
                    No snaps found.
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

export default SnapPanel;
