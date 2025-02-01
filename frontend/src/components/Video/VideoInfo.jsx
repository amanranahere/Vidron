import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import getTimeDistanceToNow from "../../utils/getTimeDistance.js";
import formatSubscriber from "../../utils/formatSubscribers.js";
import { useSelector, useDispatch } from "react-redux";
import { setVideo } from "../../store/videoSlice.js";
import { updatePlaylists } from "../../store/playlistsSlice.js";
import PlaylistForm from "../Playlist/PlaylistForm.jsx";
import LoginPopup from "../Auth/LoginPopup.jsx";
import axiosInstance from "../../utils/axios.helper.js";
import { toast } from "react-toastify";
import getUserProfile from "../../hooks/getUserProfile.js";
import getUserPlaylist from "../../hooks/getUserPlaylist.js";
import getUserSubscribed from "../../hooks/getUserSubscribed.js";
import { setSubscriptions } from "../../store/authSlice.js";

function VideoInfo({ video }) {
  const timeDistance = getTimeDistanceToNow(video?.createdAt);
  const authStatus = useSelector((state) => state.auth.status);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [menu, setMenu] = useState(false);
  const LoginLikePopupDialog = useRef();
  const LoginSubsPopupDialog = useRef();
  const LoginSavePopupDialog = useRef();
  const ref = useRef(null);
  const dialog = useRef();
  const location = useLocation();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const userId = useSelector((state) => state.auth.userData._id);
  const [playlists, setPlaylists] = useState([]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const toggleVideoLike = async () => {
    if (!authStatus) {
      LoginLikePopupDialog.current.open();
    } else {
      try {
        const response = await axiosInstance.post(
          `/likes/toggle/video/${video._id}`
        );
        if (response.data.success) {
          dispatch(
            setVideo({
              ...video,
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

  const subscriptions = useSelector((state) => state.auth.subscriptions);

  const isSubscribed =
    Array.isArray(subscriptions) &&
    subscriptions.some(
      (subscribedChannel) => subscribedChannel.username === video.owner.username
    );

  const toggleSubscribe = async () => {
    if (!authStatus) {
      LoginSubsPopupDialog.current.open();
    } else {
      try {
        const isSubscribed = subscriptions.some(
          (sub) => sub.username === video.owner.username
        );

        const response = await axiosInstance.post(
          `/subscriptions/channel/${video.owner._id}`
        );

        if (response.data.success) {
          dispatch(
            setVideo({
              ...video,
              owner: {
                ...video.owner,
                isSubscribed: !isSubscribed,
                subscribersCount: response.data.data.numOfSubscribers,
              },
            })
          );

          if (isSubscribed) {
            dispatch(
              setSubscriptions(
                subscriptions.filter(
                  (sub) => sub.username !== video.owner.username
                )
              )
            );
          } else {
            dispatch(
              setSubscriptions([
                ...subscriptions,
                { username: video.owner.username, _id: video.owner._id },
              ])
            );
          }
        }
      } catch (error) {
        console.log(error);
        toast.error("Error while toggling subscribe button");
      }
    }
  };

  useEffect(() => {
    if (authStatus && userId) {
      getUserSubscribed(dispatch, userId).then((response) => {
        if (response?.data) {
          dispatch(setSubscriptions(response.data));
        }
      });
    }
  }, [authStatus, userId, dispatch]);

  useEffect(() => {
    getUserPlaylist(dispatch, userId)
      .then((fetchedPlaylists) => {
        setPlaylists(fetchedPlaylists?.data?.userPlaylist || []);
      })
      .catch(() => setLoading(false));
  }, [userId, dispatch]);

  useEffect(() => {
    if (authStatus) {
      getUserPlaylist();
    }
  }, [authStatus]);

  const handlePlaylistVideo = async (playlistId, status) => {
    if (!playlistId && !status) return;

    if (status) {
      try {
        const response = await axiosInstance.patch(
          `/playlists/playlist/${playlistId}/video/${video._id}`
        );

        if (response?.data?.success) {
          toast.success(response.data.message);
          dispatch(
            updatePlaylists({
              playlistId: playlistId,
              isVideoPresent: true,
            })
          );
        }
      } catch (error) {
        toast.error("Error while adding video to playlist");
        console.log(error);
      }
    } else {
      try {
        const response = await axiosInstance.delete(
          `/playlists/playlist/${playlistId}/video/${video._id}`
        );

        if (response?.data?.success) {
          toast.success(response.data.message);
          dispatch(
            updatePlaylists({
              playlistId: playlistId,
              isVideoPresent: false,
            })
          );
        }
      } catch (error) {
        toast.error("Error while removing the video from playlist");
        console.log(error);
      }
    }
  };

  function popupPlaylistForm() {
    dialog.current?.open();
    setMenu(false);
  }

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
    if (video?.owner?.username) {
      getUserProfile(dispatch, video.owner.username).then((res) => {
        if (res?.data) {
          setProfile(res.data);
        }
      });
    }
  }, [video?.owner?.username]);

  return (
    <div className="px-2 lg:px-0 pb-2 md:mx-1 lg:mx-0 mt-2 bg-opacity-5">
      {/* title */}
      <div className="flex justify-between lg:w-[80%]">
        <h1 className="text-[1.3rem] font-bold">{video?.title}</h1>
      </div>

      {/* avatar, like button, save button and subscribe button */}
      <div className="w-full flex flex-col mt-2 md:flex-row md:items-center justify-between">
        {/* avatar and subscribe button */}
        <div className="flex items-center">
          <div className="flex items-center">
            <Link to={`/channel/${video?.owner?.username}`}>
              <img
                className={`w-11 h-11 mr-3 rounded-full object-cover`}
                src={`${video?.owner?.avatar}`}
                alt={video?.owner?.fullname}
              />
            </Link>

            <div>
              <p className="font-semibold ">{video?.owner?.fullname}</p>

              <p className="text-gray-300 text-[0.8rem]">
                {formatSubscriber(profile?.subscribersCount)}
              </p>
            </div>
          </div>

          {/* subscribe button */}
          <div className="justify-center items-center max-w-max ml-auto md:ml-4">
            <LoginPopup
              ref={LoginSubsPopupDialog}
              message="Login to Subscribe..."
              route={location.pathname}
            />

            <button
              onClick={toggleSubscribe}
              className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
                isSubscribed
                  ? "bg-[#3a3a3a] text-white hover:bg-[#2a2a2a]"
                  : "bg-white text-black hover:bg-white/60"
              }`}
            >
              {isSubscribed ? (
                <p className="font-semibold">Subscribed</p>
              ) : (
                <p className="font-semibold">Subscribe</p>
              )}
            </button>
          </div>
        </div>

        {/* save and like button */}
        <div className="flex justify-start items-center mt-2 md:mt-0">
          <div className="flex justify-start items-center">
            {/* save button */}
            <>
              <PlaylistForm ref={dialog} route={location} />

              <LoginPopup
                ref={LoginSavePopupDialog}
                message="Login to add this video in playlist..."
                route={location.pathname}
              />

              <div ref={ref} className="relative">
                <button
                  onClick={() => {
                    if (authStatus) {
                      setMenu((prev) => !prev);
                    } else {
                      LoginSavePopupDialog.current.open();
                    }
                  }}
                  className="bookmarkBtn"
                >
                  <span className="IconContainer">
                    <svg
                      viewBox="0 0 384 512"
                      height="0.9em"
                      className="saveIcon"
                    >
                      <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"></path>
                    </svg>
                  </span>
                  <p className="saveText">Save</p>
                </button>

                {menu && (
                  <div className="absolute left-0 md:left-auto md:right-0 top-full z-10 w-64 overflow-hidden rounded-[20px] bg-[#1a1a1a] p-4 hover:block peer-focus:block flex-col">
                    <div className="flex justify-between">
                      <h3 className="mb-4 text-center text-lg font-semibold">
                        Save to playlist
                      </h3>

                      <div className="">
                        <div
                          tabIndex="0"
                          className="max-w-7 max-h-7 plusButton"
                          onClick={popupPlaylistForm}
                        >
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
                      </div>
                    </div>

                    <ul className="">
                      {playlists?.length > 0 ? (
                        playlists?.map((item) => (
                          <li key={item._id} className="mb-2 last:mb-0 text-sm">
                            <label
                              htmlFor={"collection" + item._id}
                              className="group/label inline-flex cursor-pointer items-center gap-x-3"
                            >
                              <input
                                className="appearance-none h-3 w-3 rounded-full border-2 border-white checked:bg-white checked:border-white focus:outline-none"
                                type="checkbox"
                                id={"collection" + item._id}
                                defaultChecked={item.isVideoPresent}
                                onChange={(e) =>
                                  handlePlaylistVideo(
                                    item._id,
                                    e.target.checked
                                  )
                                }
                              />
                              {item.name}
                            </label>
                          </li>
                        ))
                      ) : (
                        <div className="text-center text-gray-400 py-4">
                          No playlist created
                        </div>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </>

            {/* like button */}
            <>
              <LoginPopup
                ref={LoginLikePopupDialog}
                message="Login to Like this Video..."
                route={location.pathname}
              />

              <div className="like-container" onClick={() => toggleVideoLike()}>
                <input
                  type="checkbox"
                  className="on"
                  id={`thumbs-up-${video._id}`}
                />
                <label
                  htmlFor={`thumbs-up-${video._id}`}
                  className="like-button"
                >
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
                  <div className="like-count one">{video?.likesCount}</div>
                  <div className="like-count two">{video?.likesCount}</div>
                </label>
              </div>
            </>
          </div>
        </div>
      </div>

      {/* description, views and upload time */}
      <div
        className={`my-2 md:my-2 lg:my-4 p-3 bg-[#2a2a2a] rounded-[20px] overflow-hidden flex-col justify-between transition duration-400 ${
          showFullDescription
            ? "cursor-default"
            : "cursor-pointer hover:bg-[#3a3a3a]"
        }`}
        onClick={() => {
          if (!showFullDescription) toggleDescription();
        }}
      >
        <p className="text-[0.9rem] mb-2 font-semibold">
          {`${video?.views} views`}
          &nbsp;
          {` ${timeDistance}`}
        </p>

        <p className={`${showFullDescription ? "" : "line-clamp-2"}`}>
          {video.description ? video.description : "No description"}
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
  );
}

export default VideoInfo;
