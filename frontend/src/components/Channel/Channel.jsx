import React, { useEffect, useRef, useState } from "react";
import {
  NavLink,
  Outlet,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "../Icons.jsx";
import getUserProfile from "../../hooks/getUserProfile.js";
import axiosInstance from "../../utils/axios.helper.js";
import LoginPopup from "../Auth/LoginPopup.jsx";
import GuestComponent from "../GuestPages/GuestComponent.jsx";
import VideoForm from "./VideoForm.jsx";
import SnapForm from "./SnapForm.jsx";
import { FaUserAltSlash } from "react-icons/fa";

function Channel() {
  const dispatch = useDispatch();
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const { status, userData } = useSelector((state) => state.auth);
  const LoginPopupDialog = useRef();
  const videoUploadRef = useRef();
  const snapUploadRef = useRef();
  const location = useLocation();

  const viewify_coverImage = "/viewify_coverImage.jpg";

  useEffect(() => {
    setError("");
    getUserProfile(dispatch, username).then((res) => {
      if (res?.data) {
        setProfile(res?.data);
      } else {
        setError(
          <GuestComponent
            title="Channel does not exist"
            subtitle="There is no channel for given username. Check the username again."
            icon={
              <span className="w-full h-full flex items-center p-4">
                <FaUserAltSlash className="w-28 h-28" />
              </span>
            }
            guest={false}
          />
        );
      }
    });
  }, [status, username]);

  const toggleSubscribe = async () => {
    try {
      const response = await axiosInstance.post(
        `/subscriptions/channel/${profile._id}`
      );
      if (response?.data?.success) {
        setProfile({
          ...profile,
          isSubscribed: !profile.isSubscribed,
          subscribersCount: profile.isSubscribed
            ? profile.subscribersCount - 1
            : profile.subscribersCount + 1,
        });
      }
    } catch (error) {
      toast.error("Error while toggling subscribe button");
      console.log(error);
    }
  };

  if (error) {
    return error;
  }

  return profile ? (
    <section className="relative w-full pb-[70px] sm:ml-[70px] md:ml-0 sm:pb-0 lg:ml-0">
      {/* cover image */}
      <div className="relative min-h-[150px] w-full pt-[20%]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={profile?.coverImage || viewify_coverImage}
            alt="user"
            className="object-cover"
          />
        </div>
      </div>

      <div className="px-2 md:px-4 pb-14 lg:pb-4">
        <div className="flex flex-wrap gap-4 pb-4 pt-2">
          <span className="relative -mt-12 inline-block h-32 w-32 shrink-0 overflow-hidden rounded-full border-2">
            <img
              src={profile?.avatar}
              alt="image"
              className="h-full w-full object-cover"
            />
          </span>

          <div className="mr-auto inline-block">
            <h1 className="font-bold text-2xl">{profile?.fullname}</h1>
            <p className="text-sm text-gray-400">@{profile?.username}</p>
            <p className="text-sm text-gray-400">
              {profile?.subscribersCount} Subscribers ·{" "}
              {profile?.channelsSubscribedToCount} Subscribed
            </p>
          </div>

          <div className="inline-block">
            {status === true ? (
              userData?.username === profile?.username ? (
                <div className="flex gap-2">
                  <div className="">
                    <VideoForm ref={videoUploadRef} />

                    <button
                      onClick={() => videoUploadRef.current?.open()}
                      className="group p-2 flex justify-center items-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] active:scale-95 border-none rounded-xl z-20 hover:transition duration-1000"
                    >
                      <span className="pl-2 font-bold text-gray-100">
                        UPLOAD VIDEO
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
                  </div>

                  <div className="block">
                    <SnapForm ref={snapUploadRef} />

                    <button
                      onClick={() => snapUploadRef.current?.open()}
                      className="group p-2 flex justify-center items-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] active:scale-95 border-none rounded-xl z-20 hover:transition duration-1000"
                    >
                      <span className="pl-2 font-bold text-gray-100">
                        UPLOAD SNAP&nbsp;
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
                  </div>
                </div>
              ) : (
                <button
                  onClick={toggleSubscribe}
                  className={`flex items-center px-4 py-2 rounded-full lg:mt-4 ${
                    profile?.isSubscribed
                      ? "hover:bg-[#2a2a2a] bg-[#3a3a3a] text-white"
                      : "hover:bg-white/60 bg-white text-black"
                  }`}
                >
                  {profile?.isSubscribed ? (
                    <>
                      <p className="font-semibold">Subscribed</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold">Subscribe</p>
                    </>
                  )}
                </button>
              )
            ) : (
              <>
                <LoginPopup
                  ref={LoginPopupDialog}
                  message="Login to Subscribe..."
                  route={location.pathname}
                />

                <button
                  onClick={() => {
                    LoginPopupDialog.current.open();
                  }}
                  className="flex items-center rounded-lg hover:bg-white/60 bg-white text-black"
                >
                  <p className="font-semibold">Subscribe</p>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="relative flex flex-col-reverse lg:flex-row justify-between">
          <div className="min-w-[85%] lg:pr-12">
            <Outlet />
          </div>

          <div className="w-full lg:sticky top-0 py-3 lg:py-0">
            <ul className="w-full lg:sticky lg:top-0 z-30 text-3xl font-semibold flex flex-wrap justify-center gap-1 lg:gap-0">
              <li className="lg:w-full text-end">
                <NavLink
                  to=""
                  end
                  className={({ isActive }) =>
                    isActive
                      ? "w-full text-white"
                      : "w-full text-[#6a6a6a] hover:text-[#9a9a9a]"
                  }
                >
                  <button className="">Videos</button>
                </NavLink>
              </li>

              <li className="px-3 lg:px-0 lg:w-full text-end">
                <NavLink
                  to={"snaps"}
                  end
                  className={({ isActive }) =>
                    isActive
                      ? "w-full text-white "
                      : "w-full  text-[#6a6a6a] hover:text-[#9a9a9a]"
                  }
                >
                  <button className="">Snaps</button>
                </NavLink>
              </li>

              <li className="lg:w-full text-end">
                <NavLink
                  to={"playlist"}
                  className={({ isActive }) =>
                    isActive
                      ? "w-full text-white "
                      : "w-full text-[#6a6a6a] hover:text-[#9a9a9a]"
                  }
                >
                  <button className="">Playlist</button>
                </NavLink>
              </li>

              <li className="pl-3 lg:pl-0 lg:w-full text-end">
                <NavLink
                  to={"tweets"}
                  className={({ isActive }) =>
                    isActive
                      ? "w-full text-white "
                      : "w-full text-[#6a6a6a] hover:text-[#9a9a9a]"
                  }
                >
                  <button className="">Tweets</button>
                </NavLink>
              </li>

              <li className="px-3 lg:px-0 lg:w-full text-end">
                <NavLink
                  to={"subscribed"}
                  className={({ isActive }) =>
                    isActive
                      ? "w-full text-white "
                      : "w-full text-[#6a6a6a] hover:text-[#9a9a9a]"
                  }
                >
                  <button className="">Subscribed</button>
                </NavLink>
              </li>

              <li className="lg:w-full text-end">
                <NavLink
                  to={"about"}
                  className={({ isActive }) =>
                    isActive
                      ? "w-full text-white "
                      : "w-full text-[#6a6a6a] hover:text-[#9a9a9a]"
                  }
                >
                  <button className="">About</button>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <span className="flex justify-center mt-20">{icons.bigLoading}</span>
  );
}

export default Channel;
