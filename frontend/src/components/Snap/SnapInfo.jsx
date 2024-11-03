import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { BiLike, BiSolidLike } from "react-icons/bi";
import {
  FaBell,
  FaChevronUp,
  FaChevronDown,
  FaCheckCircle,
} from "react-icons/fa";
import Button from "../Button.jsx";
import getTimeDistanceToNow from "../../utils/getTimeDistance.js";
import formatSubscriber from "../../utils/formatSubscribers.js";
import { useSelector, useDispatch } from "react-redux";
import { setSnap } from "../../store/snapSlice.js";
import LoginPopup from "../Auth/LoginPopup.jsx";
import axiosInstance from "../../utils/axios.helper.js";
import { toast } from "react-toastify";

function SnapInfo({ snap }) {
  const timeDistance = getTimeDistanceToNow(snap?.createdAt);
  const authStatus = useSelector((state) => state.auth.status);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [menu, setMenu] = useState(false);
  const LoginLikePopupDialog = useRef();
  const LoginSubsPopupDialog = useRef();
  const ref = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const toggleSnapLike = async () => {
    if (!authStatus) {
      LoginLikePopupDialog.current.open();
    } else {
      try {
        const response = await axiosInstance.post(
          `/likes/toggle/snap/${snap._id}`
        );
        if (response.data.success) {
          dispatch(
            setSnap({
              ...snap,
              isLiked: !snap.isLiked,
              likesCount: snap.isLiked
                ? snap.likesCount - 1
                : snap.likesCount + 1,
            })
          );
        }
      } catch (error) {
        toast.error("Error while toggling like button");
        console.log(error);
      }
    }
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

  return (
    <div className="border rounded-xl px-4 py-2 ml-1 mt-2 bg-opacity-5">
      <div className="flex justify-between">
        <div className="w-[80%]">
          <h1 className="text-[1.3rem] font-semibold">{snap?.title}</h1>
          <p className="text-[0.9rem] text-gray-300">{`${snap?.views} views • ${timeDistance}`}</p>
        </div>

        <div className="py-1 flex h-11">
          <>
            <LoginPopup
              ref={LoginLikePopupDialog}
              message="Login to Like this Snap..."
              route={location.pathname}
            />

            <button
              onClick={toggleSnapLike}
              className={`px-3 border rounded-lg border-gray-400 flex items-center hover:bg-gray-900`}
            >
              <p className="mr-1">{snap?.likesCount}</p>

              {snap.isLiked ? (
                <BiSolidLike className="w-5 h-5" />
              ) : (
                <BiLike className="w-5 h-5" />
              )}
            </button>
          </>
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <div className="flex items-center">
          <div className="flex items-center">
            <Link to={`/channel/${snap?.owner?.username}`}>
              <img
                className={`w-11 h-11 mr-3 rounded-full object-cover`}
                src={`${snap?.owner?.avatar}`}
                alt={snap?.owner?.fullName}
              />
            </Link>

            <div>
              <p className="text-gray-100 text-[0.9rem]">
                {snap?.owner?.fullName}
              </p>

              <p className="text-gray-300  text-[0.8rem]">
                {formatSubscriber(snap?.owner?.subscriberCount)}
              </p>
            </div>
          </div>
        </div>
        <>
          <LoginPopup
            ref={LoginSubsPopupDialog}
            message="Login to Subscribe..."
            route={location.pathname}
          />

          <Button
            onClick={toggleSubscribe}
            className={`flex h-10 items-center px-2 rounded-full ${
              snap.owner.isSubscribed
                ? "hover:bg-pink-700"
                : "hover:bg-gray-300"
            }`}
            textColor="text-black"
            bgColor={snap?.owner?.isSubscribed ? "bg-pink-600" : "bg-gray-100"}
          >
            {snap?.owner?.isSubscribed ? (
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
        </>
      </div>

      <div className="mt-4 border border-b-0 border-l-0 border-r-0 py-2 px-1 overflow-hidden flex justify-between">
        <p className={`${showFullDescription ? "" : "line-clamp-1"}`}>
          {snap.description ? snap.description : "No description"}
        </p>

        <button
          onClick={toggleDescription}
          className="text-white ml-auto flex items-end"
        >
          {showFullDescription ? (
            <>
              <FaChevronUp className="ml-1" />
            </>
          ) : (
            <>
              <FaChevronDown className="ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default SnapInfo;
