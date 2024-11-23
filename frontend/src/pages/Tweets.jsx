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
import Input from "../components/Input.jsx";

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
    <>
      <form
        onSubmit={handleSubmit(addTweet)}
        className="mt-4 border pb-2 rounded-lg mx-4"
      >
        <textarea
          className="mb-2 w-full resize-none border-none bg-transparent px-3 pt-2 outline-none"
          placeholder="Write a tweet"
          rows={"2"}
          required
          {...register("content", {
            required: true,
            validate: {
              tweetContent: (value) =>
                value.trim().length > 0 || "Content is required",
              tweetLength: (value) =>
                (value.trim().length > 9 && value.trim().length < 501) ||
                "Minimum 10 and maximum 500 characters allowed",
            },
          })}
        />

        {/* Tweet image input */}
        <Input
          label="Tweet Image"
          type="file"
          placeholder="Upload your tweet image"
          className="px-2 rounded-lg"
          className2="pt-5"
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

        {errors.tweetImage && (
          <p className="text-red-600 px-2 mt-1">{errors.tweetImage.message}</p>
        )}

        <div className="flex items-center justify-between gap-x-3 px-3">
          <div className="flex-grow">
            {errors.content && (
              <p className="text-red-600 mt-0.5 text-sm">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-x-3">
            <Button
              className="rounded-lg hover:bg-slate-800"
              bgColor=""
              onClick={() => reset()}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="font-semibold hover:bg-pink-700 rounded-lg flex items-center justify-center"
              bgColor="bg-pink-600"
              disabled={isUploading}
            >
              {isUploading ? (
                <span className="flex items-center">
                  {icons.smallLoading} Uploading...
                </span>
              ) : (
                "Add"
              )}
            </Button>

            <LoginPopup
              ref={LoginPopupDialog}
              message="Login to Tweet..."
              route={location.pathname}
            />
          </div>
        </div>
      </form>

      <div className="mt-6 border-b border-gray-400"></div>

      {tweets?.length > 0 ? (
        <InfiniteScroll
          dataLength={tweets.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center h-7 mt-1">{icons.loading}</div>
          }
          scrollableTarget="scrollableDiv"
        >
          <ul className="py-4 px-4">
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
    </>
  );
}

export default Tweets;
