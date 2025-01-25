import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import getTimeDistanceToNow from "../../utils/getTimeDistance.js";
import formatSubscriber from "../../utils/formatSubscribers.js";
import { useSelector, useDispatch } from "react-redux";
import { setSnap } from "../../store/snapSlice.js";
import LoginPopup from "../Auth/LoginPopup.jsx";
import axiosInstance from "../../utils/axios.helper.js";
import { toast } from "react-toastify";
import Comments from "./SnapComments.jsx";
import getUserProfile from "../../hooks/getUserProfile.js";

function SnapInfo({ snap }) {
  const timeDistance = getTimeDistanceToNow(snap?.createdAt);
  const authStatus = useSelector((state) => state.auth.status);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [menu, setMenu] = useState(false);
  const LoginSubsPopupDialog = useRef();
  const ref = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const toggleSubscribe = async () => {
    if (!authStatus) {
      LoginSubsPopupDialog.current.open();
    } else {
      try {
        const response = await axiosInstance.post(
          `/subscriptions/channel/${snap.owner._id}`
        );

        if (response.data.success) {
          dispatch(
            setSnap({
              ...snap,
              owner: {
                ...snap.owner,
                isSubscribed: !snap.owner.isSubscribed,
                subscriberCount: snap.owner.isSubscribed
                  ? snap.owner.subscriberCount - 1
                  : snap.owner.subscriberCount + 1,
              },
            })
          );
        }
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

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (snap?.owner?.username) {
      getUserProfile(dispatch, snap.owner.username).then((res) => {
        if (res?.data) {
          setProfile(res.data);
        }
      });
    }
  }, [snap?.owner?.username]);

  return (
    <>
      <div className="z-20 relative bg-[#121212] rounded-[20px] border border-[#333] h-full">
        {/* title */}
        <div className="flex justify-between py-4 px-4">
          <div className="w-full">
            <h1 className="text-[1.3rem] font-semibold">{snap?.title}</h1>
          </div>
        </div>

        {/* avatar, channel name and subscriber count */}
        <div className="flex justify-between mt-1 px-4">
          <div className="flex items-center">
            <div className="flex items-center">
              <Link to={`/channel/${snap?.owner?.username}`}>
                <img
                  className={`w-11 h-11 mr-3 rounded-full object-cover`}
                  src={`${snap?.owner?.avatar}`}
                  alt={snap?.owner?.fullname}
                />
              </Link>

              <div>
                <p className="text-gray-100 text-[0.9rem] font-bold">
                  {snap?.owner?.fullname}
                </p>

                <p className="text-gray-300  text-[0.8rem]">
                  {formatSubscriber(profile?.subscribersCount)}
                </p>
              </div>
            </div>
          </div>

          {/* subscribe button */}
          <>
            <LoginPopup
              ref={LoginSubsPopupDialog}
              message="Login to Subscribe..."
              route={location.pathname}
            />

            <button
              onClick={toggleSubscribe}
              className={`flex items-center px-4 py-2 rounded-full ${
                snap.owner.isSubscribed
                  ? "hover:bg-[#2a2a2a] bg-[#3a3a3a] text-white"
                  : "hover:bg-white/60 bg-white text-black"
              }`}
            >
              {snap?.owner?.isSubscribed ? (
                <p className="font-semibold">Subscribed</p>
              ) : (
                <p className="font-semibold">Subscribe</p>
              )}
            </button>
          </>
        </div>

        {/* description and views */}
        <div
          className={`absolute z-20 mt-4 mb-2 p-3 mx-4 bg-[#2a2a2a] rounded-[20px] overflow-hidden flex-col justify-between transition duration-400 ${
            showFullDescription
              ? "cursor-default"
              : "cursor-pointer hover:bg-[#3a3a3a]"
          }`}
          onClick={() => {
            if (!showFullDescription) toggleDescription();
          }}
        >
          <p className="text-[0.9rem] text-gray-300">{`${snap?.views} views • ${timeDistance}`}</p>
          <p className={`${showFullDescription ? "" : "line-clamp-1"}`}>
            {snap.description ? snap.description : "No description"}
          </p>

          {showFullDescription && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleDescription();
              }}
              className="text-gray-500 text-sm ml-auto flex items-end hover:underline"
            >
              show less
            </button>
          )}
        </div>

        {/* comments */}
        <div className="mt-[10px]">
          <Comments snap={snap} />
        </div>
      </div>
    </>
  );
}

export default SnapInfo;
