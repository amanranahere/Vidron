import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axios.helper.js";
import getTimeDistanceToNow from "../../utils/getTimeDistance.js";
import LoginPopup from "../Auth/LoginPopup.jsx";
import getUserTweets from "../../hooks/getUserTweets.js";
import { removeUserTweets } from "../../store/userSlice.js";
import { useForm } from "react-hook-form";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  deleteTweet,
  updateTweet,
  toggleLike,
} from "../../store/tweetsSlice.js";

function Tweet({ tweet, page = false }) {
  const { status, userData } = useSelector((state) => state.auth);
  const [update, setUpdate] = useState(false);
  const [menu, setMenu] = useState(false);
  const [likesCount, setLikesCount] = useState(tweet.likesCount);
  const dispatch = useDispatch();
  const LoginLikePopupDialog = useRef();
  const ref = useRef(null);
  const location = useLocation();
  const { register, handleSubmit, setValue } = useForm();

  const handleTweetDelete = async () => {
    try {
      await axiosInstance.delete(`tweets/tweet/${tweet._id}`).then(() => {
        if (page) {
          dispatch(deleteTweet(tweet._id));
        } else {
          dispatch(removeUserTweets());
          getUserTweets(dispatch, userData._id);
        }
      });
    } catch (error) {
      toast.error("Couldn't delete tweet. Try again!");
      console.log("Error while deleting tweet", error);
    }
  };

  const handleTweetUpdate = async (data) => {
    try {
      await axiosInstance
        .patch(`/tweets/${tweet._id}`, {
          content: data.newContent,
        })
        .then((res) => {
          if (page) {
            dispatch(updateTweet(res.data.data));
          } else {
            dispatch(removeUserTweets());
            getUserTweets(dispatch, userData._id);
          }
        });
    } catch (error) {
      toast.error("Couldn't update tweet. Try again!");
      console.error("Error while updating tweet", error);
    }
  };

  const toggleTweetLike = async () => {
    if (!status) {
      LoginLikePopupDialog.current.open();
    } else {
      try {
        await axiosInstance
          .post(`/likes/toggle/tweet/${tweet._id}`)
          .then(() => {
            const newLikesCount = tweet.isLiked
              ? likesCount - 1
              : likesCount + 1;
            setLikesCount(newLikesCount);

            if (page) {
              dispatch(
                toggleLike({
                  tweetId: tweet._id,
                  isLiked: !tweet?.isLiked,
                  likesCount: tweet.likesCount,
                })
              );
            } else {
              getUserTweets(dispatch, userData._id);
            }
          });
      } catch (error) {
        toast.error("Error while toggling like button");
        console.log(error);
      }
    }
  };

  const handleUpdate = () => {
    setUpdate(true);
    setValue("newContent", tweet.content);
    setMenu(false);
  };

  const cancelEditing = () => {
    setUpdate(false);
  };

  const handleDelete = () => {
    handleTweetDelete();
    setMenu(false);
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
    <div className="lg:max-w-[800px] w-full ">
      <li className="flex-col relative bg-[#121212] rounded-[20px] border border-[#333] py-4 px-2 md:px-4 mb-2 mx-4">
        {/* avatar, fullname, created-at and three-dot button */}
        <div className="flex items-center">
          {/* avatar */}

          <div className="shrink-0 max-h-max">
            <Link
              to={`${
                userData?._id === tweet?.owner?._id
                  ? ""
                  : "/channel/" + tweet?.owner?.username
              }`}
            >
              <img
                src={tweet?.owner?.avatar}
                alt="user"
                className="rounded-full object-cover w-10 h-10 md:w-14 md:h-14"
              />
            </Link>
          </div>

          {/* fullname and created-at */}
          <div className="px-3 md:pr-14 justify-start flex-grow">
            <div className="flex">
              <p className=" font-semibold mr-2">{tweet?.owner?.fullname}</p>
              <p>·</p>
              <p className="ml-2 text-gray-300">
                {getTimeDistanceToNow(tweet?.createdAt)}
              </p>
            </div>
          </div>

          {/* three-dot button */}
          {tweet?.owner?._id === userData?._id && (
            <div ref={ref} className="relative">
              <button
                onClick={() => setMenu((prev) => !prev)}
                className="p-2 hover:bg-slate-800 hover:rounded-full"
              >
                <BsThreeDotsVertical />
              </button>

              {menu && (
                <div className="absolute right-0 w-24 bg-black rounded-lg shadow-lg text-sm">
                  <button
                    onClick={() => handleUpdate()}
                    className="block w-full text-left px-4 py-2 hover:bg-[#2a2a2a] hover:rounded-lg"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => handleDelete()}
                    className="block w-full text-left px-4 py-2 hover:bg-[#2a2a2a] hover:rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* tweet content and image */}

        <div className="my-3 mx-2">
          {update ? (
            <form
              className="mt-1 flex items-center"
              onSubmit={handleSubmit(handleTweetUpdate)}
            >
              <input
                {...register("newContent", {
                  required: true,
                })}
                className="mr-2 border-b-[1px] py-1 bg-black/0 text-white outline-none duration-200 focus:border-blue-800 w-full"
              />

              <div className="flex-col ">
                <button
                  type="submit"
                  className="w-full mb-2 border-none outline-none px-2 py-1 border rounded-[10px] bg-[#00bfff] hover:bg-[#00bfff96] active:bg-[#00bfff63] select-none hover:transition duration-500 ease-linear-out"
                >
                  Update
                </button>

                <button
                  onClick={cancelEditing}
                  className="w-full border-none outline-none px-2 py-1 bg-red-400 hover:bg-red-400/80 active:bg-red-400/60 border rounded-[10px] select-none hover:transition duration-500 ease-linear"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="mt-2 break-words ">{tweet?.content}</div>

              {tweet?.tweetImage && (
                <div className="max-h-max lg:max-w-[600px] my-4">
                  <img
                    src={tweet?.tweetImage}
                    alt="tweetImage"
                    className="h-full w-full object-cover rounded-2xl"
                  />
                </div>
              )}
            </div>
          )}

          <LoginPopup
            ref={LoginLikePopupDialog}
            message="Login to like this Tweet..."
            route={location.pathname}
          />
        </div>

        {/* like button */}

        <div className="like-container" onClick={() => toggleTweetLike()}>
          <input type="checkbox" className="on" id={`heart-${tweet._id}`} />
          <label htmlFor={`heart-${tweet._id}`} className="like-button">
            <div className="like">
              <svg
                className="like-icon"
                fillRule="nonzero"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"></path>
              </svg>
              <span className="like-text">Like</span>
            </div>
            <div className="like-count one">{likesCount}</div>
            <div className="like-count two">{likesCount}</div>
          </label>
        </div>
      </li>
    </div>
  );
}

export default Tweet;
