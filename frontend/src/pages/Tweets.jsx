import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { icons } from "../components/Icons.jsx";
import Button from "../components/Button.jsx";
import axiosInstance from "../utils/axios.helper.js";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Tweet from "../components/Tweet/TweetCard.jsx";
import { addTweets, removeTweets } from "../store/tweetsSlice.js";
import GuestComponent from "../components/GuestPages/GuestComponent.jsx";
import LoginPopup from "../components/Auth/LoginPopup.jsx";
import { TiMessages } from "react-icons/ti";
import InfiniteScroll from "react-infinite-scroll-component";

function Tweets() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [tweetsUpdated, setTweetsUpdated] = useState(false);
  const LoginPopupDialog = useRef();
  const location = useLocation();
  const tweets = useSelector((state) => state.tweets.tweets);
  const [addTweetBox, setAddTweetBox] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const getAllTweets = async () => {
    try {
      const response = await axiosInstance.get(`/tweets?page=${page}&limit=30`);
      const tweetsData = response?.data?.tweets;

      if (tweetsData) {
        if (page === 1) {
          dispatch(removeTweets());
        }
        dispatch(addTweets(tweetsData));

        if (tweetsData.length < 30) {
          setHasMore(false);
        }
      } else {
        console.error("No tweets found in the response");
      }
    } catch (error) {
      console.log("Error while fetching tweets", error);
    }
  };

  const addTweet = async (data) => {
    if (!status) {
      LoginPopupDialog.current.open();
    } else {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("content", data.content);
        if (data.tweetImage && data.tweetImage[0]) {
          formData.append("tweetImage", data.tweetImage[0]);
        }

        const response = await axiosInstance.post(`/tweets`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        dispatch(addTweets([response.data]));
        reset();
        setTweetsUpdated((prev) => !prev);
        setPage(1);
      } catch (error) {
        toast.error("Couldn't add your tweet. Try again!");
        console.log("Error while adding tweet", error);
      } finally {
        setIsUploading(false);
        setAddTweetBox(false);
      }
    }
  };

  useEffect(() => {
    if (page === 1) {
      dispatch(removeTweets());
    }
    getAllTweets().then(() => setLoading(false));
  }, [tweetsUpdated, status, page]);

  useEffect(() => {
    if (!isUploading) {
      getAllTweets();
    }
  }, [isUploading]);

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (loading) {
    return (
      <span className="flex justify-center mt-20">{icons.bigLoading}</span>
    );
  }

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setAddTweetBox(!addTweetBox)}
        className="group absolute bottom-20 right-4 lg:bottom-6 lg:right-10 p-2  flex justify-center items-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] active:scale-95 border-none rounded-full z-20 hover:transition duration-1000"
      >
        <span className="hidden md:inline-block pl-2 font-bold text-gray-100">
          CREATE TWEET
        </span>

        <div tabIndex="0" className="plusButton">
          <svg
            className="plusIcon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 30 30"
          >
            <g mask="url(#mask0_21_345)">
              <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
            </g>
          </svg>
        </div>
      </button>

      {addTweetBox && (
        <div className="fixed flex justify-center items-center inset-0 z-50 ">
          <div
            className="fixed inset-0 backdrop-blur-sm  bg-opacity-60"
            onClick={() => setAddTweetBox(false)}
          ></div>

          <form
            onSubmit={handleSubmit(addTweet)}
            className="absolute max-h-max md:min-w-[600px] md:mx-auto py-5 px-4 md:px-7 bg-[#121212] rounded-[20px] border border-[#333] m-4 flex-col justify-center items-center "
          >
            <textarea
              className="h-48 w-full resize-none border-none bg-transparent pt-2 outline-none scrollbar-thin scrollbar-thumb-[#2a2a2a] scrollbar-track-[#121212] mb-4"
              placeholder="Write a tweet"
              rows={"2"}
              required
              {...register("content", {
                required: true,
                validate: {
                  tweetContent: (value) =>
                    value.trim().length > 0 || "Content is required",
                  tweetLength: (value) =>
                    (value.trim().length > 9 && value.trim().length < 1001) ||
                    "Minimum 10 and maximum 1000 characters allowed",
                },
              })}
            />

            {/* Tweet image input */}

            <div className="signup-form py-5 flex justify-center items-center">
              <div className="avatar">
                <span className="avatar-title">Upload image</span>

                <p className="avatar-paragraph">
                  File should be an image (JPEG, JPG, or PNG format).
                </p>

                <label htmlFor="#tweet-img" className="avatar-drop-container">
                  <input
                    id="tweet-img"
                    type="file"
                    placeholder="Upload image"
                    {...register("tweetImage", {
                      required: false,
                      validate: (file) => {
                        if (!file[0]) return true;

                        const allowedExtensions = [
                          "image/jpeg",
                          "image/jpg",
                          "image/png",
                        ];
                        const fileType = file[0].type;
                        return allowedExtensions.includes(fileType)
                          ? true
                          : "Invalid file type! Only .jpeg .jpg .png files are accepted";
                      },
                    })}
                  />
                </label>

                {errors.tweetImage && (
                  <p className="text-red-600 px-2 mt-1">
                    {errors.tweetImage.message}
                  </p>
                )}
              </div>
            </div>

            {/* error-msg, add and cancel buttons */}

            <div className="w-full flex-col items-center justify-center px-3">
              <div className="flex justify-center items-center">
                {errors.content && (
                  <p className="text-red-600 mt-0.5 text-sm mb-6 text-center ">
                    {errors.content.message}
                  </p>
                )}
              </div>

              <div className="w-full flex justify-center items-start gap-x-5 ">
                <button
                  type="submit"
                  className="w-[150px] border-none outline-none px-6 py-2 border rounded-[10px] bg-[#00bfff] hover:bg-[#00bfff96] active:bg-[#00bfff63] select-none hover:transition duration-1000 ease-out"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      {icons.smallLoading} Uploading...
                    </span>
                  ) : (
                    "Post"
                  )}
                </button>

                <button
                  className="w-[150px] border-none outline-none px-4 py-2 bg-red-400 hover:bg-red-400/80 active:bg-red-400/60 border rounded-[10px] select-none hover:transition duration-1000 ease-out"
                  onClick={() => {
                    reset();
                    setAddTweetBox(false);
                  }}
                >
                  Cancel
                </button>

                <LoginPopup
                  ref={LoginPopupDialog}
                  message="Login to Tweet..."
                  route={location.pathname}
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* all tweets */}

      {tweets?.length > 0 ? (
        <InfiniteScroll
          dataLength={tweets.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center h-12 mt-1">{icons.loading}</div>
          }
          scrollableTarget="scrollableDiv"
        >
          <ul className="mb-40 my-4 md:p-2">
            {tweets.map((tweet, index) => (
              <Tweet key={tweet._id || index} tweet={tweet} page={true} />
            ))}
          </ul>
        </InfiniteScroll>
      ) : (
        <GuestComponent
          icon={
            <span className="w-full h-full flex items-center p-4 pb-5">
              <TiMessages className="w-32 h-32" />
            </span>
          }
          title="Empty Tweets"
          subtitle="There are no tweets right now. Be the first one to write a tweet."
          guest={false}
        />
      )}
    </div>
  );
}

export default Tweets;
