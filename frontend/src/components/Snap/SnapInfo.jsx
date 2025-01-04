import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBell, FaCheckCircle } from "react-icons/fa";
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
              isLiked: response.data.data.isLiked,
              likesCount: response.data.data.likesCount,
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
    <>
      <div className="bg-[#121212] rounded-[20px] border border-[#333] p-4">
        {/* title and like button */}
        <div className="flex justify-between">
          {/* title */}
          <div className="w-[80%]">
            <h1 className="text-[1.3rem] font-semibold">{snap?.title}</h1>
          </div>

          {/* like button */}
          <div>
            <LoginPopup
              ref={LoginLikePopupDialog}
              message="Login to Like this Snap..."
              route={location.pathname}
            />

            <div className="like-container" onClick={() => toggleSnapLike()}>
              <input
                type="checkbox"
                className="on"
                id={`thumbs-up-${snap._id}`}
              />
              <label htmlFor={`thumbs-up-${snap._id}`} className="like-button">
                <div className="like">
                  <svg
                    className="thumbs-up scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M3 10C3 9.44772 3.44772 9 4 9H7V21H4C3.44772 21 3 20.5523 3 20V10Z"
                        stroke="#ffffff"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                      <path
                        d="M7 11V19L8.9923 20.3282C9.64937 20.7662 10.4214 21 11.2111 21H16.4586C17.9251 21 19.1767 19.9398 19.4178 18.4932L20.6119 11.3288C20.815 10.1097 19.875 9 18.6391 9H14"
                        stroke="#ffffff"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                      <path
                        d="M14 9L14.6872 5.56415C14.8659 4.67057 14.3512 3.78375 13.4867 3.49558V3.49558C12.6336 3.21122 11.7013 3.59741 11.2992 4.4017L8 11H7"
                        stroke="#ffffff"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                  <span className="like-text">Like</span>
                </div>
                <div className="like-count one">{snap?.likesCount}</div>
                <div className="like-count two">{snap?.likesCount}</div>
              </label>
            </div>
          </div>
        </div>

        {/* avatar, channel name and subscriber count */}
        <div className="flex justify-between mt-1">
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
                  {formatSubscriber(snap?.owner?.subscriberCount)}
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

            <Button
              onClick={toggleSubscribe}
              className={`flex h-10 items-center px-2 rounded-full ${
                snap.owner.isSubscribed
                  ? "hover:bg-pink-700"
                  : "hover:bg-gray-300"
              }`}
              textColor="text-black"
              bgColor={
                snap?.owner?.isSubscribed ? "bg-pink-600" : "bg-gray-100"
              }
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

        {/* description and views */}
        <div
          className={`mt-4 mb-2 p-3 bg-[#2a2a2a] rounded-[20px] overflow-hidden flex-col justify-between transition duration-400 ${
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
      </div>
    </>
  );
}

export default SnapInfo;
