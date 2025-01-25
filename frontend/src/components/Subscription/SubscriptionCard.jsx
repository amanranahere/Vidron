import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import formatSubscribers from "../../utils/formatSubscribers.js";
import LoginPopup from "../Auth/LoginPopup.jsx";
import axiosInstance from "../../utils/axios.helper.js";
import { toast } from "react-toastify";
import { toggleUserSubscribe } from "../../store/userSlice.js";

function SubscriptionCard({ profile }) {
  const LoginPopupDialog = useRef();
  const location = useLocation();
  const dispatch = useDispatch();

  const status = useSelector((state) => state.auth.status);

  const toggleSubscribe = async () => {
    if (!status) {
      LoginPopupDialog.current.open();
    } else {
      try {
        await axiosInstance
          .post(`/subscriptions/channel/${profile._id}`)
          .then(() => {
            dispatch(
              toggleUserSubscribe({
                profileId: profile._id,
                isSubscribed: !profile?.isSubscribed,
                subscribersCount: profile?.isSubscribed
                  ? profile.subscribersCount - 1
                  : profile.subscribersCount + 1,
              })
            );
          });
      } catch (error) {
        if (error.status === 403) {
          toast.error("Cannot subscribe to your own channel");
        } else {
          toast.error("Error while toggling subscribe button");
          console.log(error);
        }
      }
    }
  };

  return (
    <>
      <LoginPopup
        ref={LoginPopupDialog}
        message="Login to Subscribe..."
        route={location.pathname}
      />

      <li
        key={profile._id}
        className="flex w-full justify-between bg-[#2a2a2a] hover:bg-[#4a4a4a] transition duration-500 p-4 rounded-[20px]"
      >
        <div className="flex items-center gap-x-3">
          <div className="h-14 w-14 shrink-0">
            <Link to={`/channel/${profile.username}`}>
              <img
                src={profile.avatar}
                alt="user"
                className="h-full w-full rounded-full object-cover"
              />
            </Link>
          </div>

          <div className="block">
            <h6 className="font-semibold line-clamp-1">{profile.fullname}</h6>
            <p className="text-sm text-gray-300">
              {formatSubscribers(profile.subscribersCount)}
            </p>
          </div>
        </div>

        <button
          onClick={toggleSubscribe}
          className={`flex items-center px-6  rounded-full ${
            profile?.isSubscribed
              ? "hover:bg-[#2a2a2a] bg-[#3a3a3a] text-white"
              : "hover:bg-white/60 bg-white text-black"
          }`}
        >
          {profile?.isSubscribed ? (
            <p className="font-semibold">Subscribed</p>
          ) : (
            <p className="font-semibold">Subscribe</p>
          )}
        </button>
      </li>
    </>
  );
}

export default SubscriptionCard;
