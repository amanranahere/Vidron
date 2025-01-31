import React, { useState, useEffect } from "react";
import ChannelEmptySubscribed from "./ChannelEmptySubscribed.jsx";
import { useSelector, useDispatch } from "react-redux";
import getUserSubscribed from "../../hooks/getUserSubscribed.js";
import { icons } from "../Icons.jsx";
import { GoSearch } from "react-icons/go";
import SubscriptionCard from "../Subscription/SubscriptionCard.jsx";

function ChannelSubscribed() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [filter, setFilter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user._id) {
      getUserSubscribed(dispatch, user._id).then(() => {
        setLoading(false);
      });
    }
  }, [user]);

  const data = useSelector((state) => state.user.userSubscribed);

  if (loading) {
    return (
      <span className="flex justify-center mt-20">{icons.bigLoading}</span>
    );
  }

  let subscribed = filter || data?.channels;

  function handleUserInput(input) {
    if (!input || input === "") setFilter(data?.channels);
    else {
      const filteredData = data?.channels.filter((subs) =>
        subs.fullname.toLowerCase().includes(input.toLowerCase())
      );

      setFilter(filteredData);
    }
  }

  return (data?.numOfChannelsSubscribedTo || 0) > 0 ? (
    <ul className="flex w-full flex-col gap-y-2 py-4 px-4">
      <div className="relative w-full py-3 px-14 rounded-full bg-[#3a3a3a] overflow-hidden">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <GoSearch />
        </span>
        <input
          onChange={(e) => handleUserInput(e.target.value.trim())}
          className="w-full bg-transparent outline-none"
          placeholder="Search"
        />
      </div>
      {subscribed?.map((profile) => (
        <SubscriptionCard key={profile._id} profile={profile} />
      ))}
    </ul>
  ) : (
    <ChannelEmptySubscribed />
  );
}

export default ChannelSubscribed;
