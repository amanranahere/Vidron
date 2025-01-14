import React from "react";
import { useSelector } from "react-redux";
import { BiSolidMessageSquareDots } from "react-icons/bi";

function ChannelEmptyTweet() {
  const { status, userData } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user.user);

  const isOwner = status && user.username === userData.username;

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-sm text-center mt-6">
        <p className="mb-3 w-full">
          <span className="inline-flex rounded-full bg-[#3a3a3a] p-3">
            <BiSolidMessageSquareDots className="w-6 h-6" />
          </span>
        </p>

        <h5 className="mb-2 font-semibold text-lg">No Tweets</h5>

        <p className="text-gray-200">
          {isOwner
            ? "You have yet to make an "
            : "This channel has yet to make an "}
          <strong>Announcement.</strong>
        </p>
      </div>
    </div>
  );
}

export default ChannelEmptyTweet;
