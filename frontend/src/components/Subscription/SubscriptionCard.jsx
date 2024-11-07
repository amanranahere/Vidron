import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import formatSubscribers from "../../utils/formatSubscribers.js";
import LoginPopup from "../Auth/LoginPopup.jsx";
import axiosInstance from "../../utils/axios.helper.js";
import { toast } from "react-toastify";
import Button from "../Button.jsx";
import { FaBell, FaCheckCircle } from "react-icons/fa";
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
                subscriberCount: profile?.isSubscribed
                  ? profile.subscribersCount - 1
                  : profile.subscriberCount + 1,
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

      <li key={profile._id} className="flex w-full justify-between">
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
            <h6 className="font-semibold">{profile.fullname}</h6>
            <p className="text-sm text-gray-300">
              {formatSubscribers(profile.subscribersCount)}
            </p>
          </div>
        </div>

        <Button
          onClick={toggleSubscribe}
          className={`flex h-9 items-center px-2 rounded-lg ${
            profile?.isSubscribed ? "hover:bg-pink-700" : "hover:bg-gray-300"
          }`}
          textColor="text-black"
          bgColor={profile?.isSubscribed ? "bg-pink-600" : "bg-gray-100"}
        >
          {profile?.isSubscribed ? (
            <>
              <p className="mr-2 font-semibold">Subscribed</p>
              <FaCheckCircle />
            </>
          ) : (
            <>
              <p className="mr-2 font-semibold">Subscribe</p>
              <FaBell />
            </>
          )}
        </Button>
      </li>
    </>
  );
}

export default SubscriptionCard;
