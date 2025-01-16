import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { GoHome, GoHomeFill } from "react-icons/go";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import {
  BiMessageSquareDots,
  BiSolidMessageSquareDots,
  BiFilm,
} from "react-icons/bi";
import { RiSettings4Line, RiSettings4Fill } from "react-icons/ri";
import {
  IoHelpCircleOutline,
  IoHelpCircle,
  IoClose,
  IoHeartOutline,
  IoHeartSharp,
} from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import {
  MdKeyboardArrowRight,
  MdOutlineSubscriptions,
  MdSubscriptions,
  MdDashboard,
  MdOutlineDashboard,
  MdHistory,
  MdOutlineHistory,
  MdFeedback,
  MdOutlineFeedback,
} from "react-icons/md";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import axiosInstance from "../utils/axios.helper.js";
import { logout } from "../store/authSlice.js";
import { toast } from "react-toastify";

function Sidebar({ onClose }) {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const isSnapWatchPage = location.pathname.includes("/snap");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const NavElements = [
    {
      name: "Home",
      route: "/",
      icon: <GoHome className="w-6 h-6" />,
      activeIcon: <GoHomeFill className="w-6 h-6" />,
    },
    {
      name: "Snaps",
      route: "/snaps",
      icon: <BiFilm className="w-6 h-6" />,
      activeIcon: <BiFilm className="w-6 h-6" />,
    },
    {
      name: "Tweets",
      route: "/tweets",
      icon: <BiMessageSquareDots className="w-6 h-6" />,
      activeIcon: <BiSolidMessageSquareDots className="w-6 h-6" />,
    },
    {
      name: "Subscriptions",
      route: "/subscriptions",
      icon: <MdOutlineSubscriptions className="w-6 h-6" />,
      activeIcon: <MdSubscriptions className="w-6 h-6" />,
    },
    {
      name: "Metrics",
      route: "/admin/metrics",
      icon: <MdOutlineDashboard className="w-6 h-6" />,
      activeIcon: <MdDashboard className="w-6 h-6" />,
      requiresAuth: true,
    },
    {
      name: "History",
      route: "/history",
      icon: <MdOutlineHistory className="w-6 h-6" />,
      activeIcon: <MdHistory className="w-6 h-6" />,
    },
    {
      name: "Liked Videos",
      route: "/liked-videos",
      icon: <AiOutlineLike className="w-6 h-6" />,
      activeIcon: <AiFillLike className="w-6 h-6" />,
    },
    {
      name: "Liked Snaps",
      route: "/liked-snaps",
      icon: <AiOutlineLike className="w-6 h-6" />,
      activeIcon: <AiFillLike className="w-6 h-6" />,
    },
    {
      name: "Liked Tweets",
      route: "/liked-tweets",
      icon: <IoHeartOutline className="w-6 h-6" />,
      activeIcon: <IoHeartSharp className="w-6 h-6" />,
    },
    {
      name: "Settings",
      route: "/settings",
      icon: <RiSettings4Line className="w-6 h-6" />,
      activeIcon: <RiSettings4Fill className="w-6 h-6" />,
      requiresAuth: true,
    },
    {
      name: "Help",
      route: "/help",
      icon: <IoHelpCircleOutline className="w-6 h-6" />,
      activeIcon: <IoHelpCircle className="w-6 h-6" />,
    },
    {
      name: "Send Feedback",
      route: "/send-feedback",
      icon: <MdOutlineFeedback className="w-6 h-6" />,
      activeIcon: <MdFeedback className="w-6 h-6" />,
    },
  ];

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/users/logout", {});
      dispatch(logout());
      localStorage.removeItem("accessToken");
      toast.success("Logged out successfully...");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <>
      {/* sidebar - for bigger screens */}

      <div className="h-full hidden lg:block overflow-y-scroll scrollbar-thin scrollbar-thumb-[#2a2a2a] scrollbar-track-black">
        <div className="w-64 bg-black text-white h-full flex flex-col transition-all duration-100 ease-in-out">
          {/* home, snaps, tweets, subscriptions */}

          <ul className=" px-2 py-2">
            {NavElements.filter((item) =>
              ["Home", "Snaps", "Tweets", "Subscriptions"].includes(item.name)
            ).map((item, index) => (
              <NavLink
                className={({ isActive }) =>
                  `${isActive ? "text-white font-bold" : "text-gray-200"}`
                }
                to={item.route}
                key={index}
                onClick={() => {
                  onClose();
                }}
              >
                {({ isActive }) => (
                  <li
                    className={`px-5 py-2 hover:bg-[#2a2a2a] transition-all duration-100 cursor-pointer flex items-center rounded-lg ${
                      isActive ? "bg-[#2a2a2a]" : ""
                    } `}
                  >
                    <span className="mr-2">
                      {isActive ? item.activeIcon : item.icon}
                    </span>

                    {item.name}
                  </li>
                )}
              </NavLink>
            ))}
          </ul>

          <hr className="mx-5 my-2 opacity-25" />

          {/* You - metrics, history, liked videos, snaps, tweets */}

          <div className="h-full px-2 py-2">
            <NavLink
              className={({ isActive }) =>
                `${isActive ? "text-white font-bold" : "text-gray-200"}`
              }
              to={`/channel/${userData?.username}`}
              onClick={() => {
                onClose();
              }}
            >
              {({ isActive }) => (
                <div
                  className={`px-5 py-1 flex items-center gap-3 hover:bg-[#2a2a2a] transition-all duration-100 cursor-pointer rounded-lg ${
                    isActive ? "bg-[#2a2a2a]" : ""
                  } `}
                >
                  <span className="text-lg pt-1 font-semibold">You</span>
                  <span className="pt-1 text-2xl opacity-75">
                    <MdKeyboardArrowRight />
                  </span>
                </div>
              )}
            </NavLink>

            <ul className="flex-grow">
              {NavElements.filter(
                (item) =>
                  [
                    "Metrics",
                    "History",
                    "Liked Videos",
                    "Liked Snaps",
                    "Liked Tweets",
                  ].includes(item.name) &&
                  (!item.requiresAuth || authStatus)
              ).map((item, index) => (
                <NavLink
                  className={({ isActive }) =>
                    `${isActive ? "text-white font-bold" : "text-gray-200"}`
                  }
                  to={item.route}
                  key={index}
                  onClick={() => {
                    onClose();
                  }}
                >
                  {({ isActive }) => (
                    <li
                      className={`px-5 py-2 hover:bg-[#2a2a2a] transition-all duration-100 cursor-pointer flex items-center rounded-lg ${
                        isActive ? "bg-[#2a2a2a]" : ""
                      } `}
                    >
                      <span className="mr-2">
                        {isActive ? item.activeIcon : item.icon}
                      </span>

                      {item.name}
                    </li>
                  )}
                </NavLink>
              ))}
            </ul>
          </div>

          <hr className="mx-5 my-2 opacity-25" />

          {!authStatus && (
            <>
              <div className="flex flex-col px-5 py-2">
                <span>Sign up to like, comment, and post tweets! </span>

                <button
                  className="max-w-max mt-3 mb-2 cursor-pointer hover:bg-gray-600 active:bg-gray-700 mr-1 px-4 py-2 rounded-full border border-solid border-[#6a6a6a] text-[#00bfff] font-bold flex"
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  <FaRegUserCircle className="text-2xl opacity-90 mr-2" />
                  Sign up
                </button>
              </div>

              <hr className="mx-5 my-2 opacity-25" />
            </>
          )}

          {/* settings, logout */}

          {authStatus && (
            <>
              <ul className="px-2 py-2">
                <NavLink
                  className={({ isActive }) =>
                    `${isActive ? "text-white font-bold" : "text-gray-200"}`
                  }
                  to={
                    NavElements.find((item) => item.name === "Settings")?.route
                  }
                  onClick={() => {
                    onclose();
                    setIsDialogOpen(false);
                  }}
                >
                  {({ isActive }) => (
                    <div
                      className={`px-5 py-2 hover:bg-[#2a2a2a] transition-all duration-100 cursor-pointer flex items-center rounded-lg ${
                        isActive ? "bg-[#2a2a2a]" : ""
                      } `}
                    >
                      <span className="mr-2">
                        {
                          NavElements.find((item) => item.name === "Settings")[
                            isActive ? "activeIcon" : "icon"
                          ]
                        }
                      </span>
                      <span>Settings</span>
                    </div>
                  )}
                </NavLink>

                <li
                  onClick={handleLogout}
                  className="px-5 py-2 hover:bg-[#2a2a2a] transition-all duration-100 cursor-pointer flex items-center rounded-lg"
                >
                  <span>
                    <IoIosLogOut className="w-7 h-6 mr-2" />
                  </span>
                  Logout
                </li>
              </ul>

              <hr className="mx-5 my-2 opacity-25" />
            </>
          )}

          {/* help, send-feedback */}

          <ul className="px-2 py-2">
            {NavElements.filter(
              (item) =>
                ["Help", "Send Feedback"].includes(item.name) &&
                (!item.requiresAuth || authStatus)
            ).map((item, index) => (
              <NavLink
                className={({ isActive }) =>
                  `${isActive ? "text-white font-bold" : "text-gray-200"}`
                }
                to={item.route}
                key={index}
                onClick={() => {
                  onClose();
                }}
              >
                {({ isActive }) => (
                  <li
                    className={`px-5 py-2 hover:bg-[#2a2a2a] transition-all duration-100 cursor-pointer flex items-center rounded-lg ${
                      isActive ? "bg-[#2a2a2a]" : ""
                    } `}
                  >
                    <span className="mr-2">
                      {isActive ? item.activeIcon : item.icon}
                    </span>

                    {item.name}
                  </li>
                )}
              </NavLink>
            ))}
          </ul>

          <hr className="mx-5 my-2 opacity-25" />

          <span className="pl-7 pt-1 pb-3 flex items-center text-[0.8rem] text-gray-200 opacity-60">
            &copy; 2025
          </span>
        </div>
      </div>

      {/* bottom bar - for smaller screens */}

      <div
        className={`fixed bottom-0 left-0 right-0 bg-black text-white flex justify-around items-center py-2 lg:hidden z-40 ${
          isSnapWatchPage ? "hidden md:flex" : ""
        }`}
      >
        {NavElements.filter(
          (item) =>
            ["Home", "Snaps", "Tweets"].includes(item.name) &&
            (!item.requiresAuth || authStatus)
        ).map((item, index) => (
          <NavLink
            className={({ isActive }) =>
              `${isActive ? "text-white font-bold" : "text-gray-200"}`
            }
            to={item.route}
            key={index}
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center">
                <span>{isActive ? item.activeIcon : item.icon}</span>
                <span className="text-xs">{item.name}</span>
              </div>
            )}
          </NavLink>
        ))}

        {/* Icon to open the dialog */}

        <button
          className="flex flex-col items-center text-gray-200"
          onClick={() => setIsDialogOpen(true)}
        >
          <HiOutlineMenuAlt4 className="w-6 h-6" />
          <span className="text-xs">Menu</span>
        </button>
      </div>

      {/* menu dialog box */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#2a2a2a] scrollbar-track-black">
          <div className="relative w-5/6 md:w-2/3 max-w-[600px] h-auto bg-[#1a1a1a] rounded-3xl border border-[#333] backdrop:backdrop-blur-sm">
            <h1 className="text-2xl md:text-3xl text-[#00bfff] py-5 text-center">
              Menu
            </h1>

            <button
              autoFocus
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="absolute right-2 top-2 h-7 w-7 focus:border-dotted  text-[#00bfff] z-50"
            >
              <IoClose className="w-7 h-7" />
            </button>

            {/* subscriptions, metrics, history, liked videos, liked snaps, liked tweets */}

            <ul className="text-xl text-[#ffffffb3]">
              {NavElements.filter(
                (item) =>
                  [
                    "Subscriptions",
                    "Metrics",
                    "History",
                    "Liked Videos",
                    "Liked Snaps",
                    "Liked Tweets",
                  ].includes(item.name) &&
                  (!item.requiresAuth || authStatus)
              ).map((item, index) => (
                <NavLink
                  className={`block hover:text-[#00bfffd2] ${
                    index % 2 === 0 ? "bg-[#3a3a3a]" : "bg-[#2a2a2a]"
                  }`}
                  to={item.route}
                  key={index}
                  onClick={() => setIsDialogOpen(false)}
                >
                  <div className="flex items-center gap-2 pl-4 py-3 md:py-4 active:bg-gray-800">
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                </NavLink>
              ))}
            </ul>

            <hr className="mx-5 my-2 opacity-0" />

            {/* settings and logout */}
            {authStatus && (
              <>
                <ul className="text-xl text-[#ffffffb3]">
                  {/* Settings */}

                  <NavLink
                    className="block hover:text-[#00bfffd2] bg-[#3a3a3a]"
                    to={
                      NavElements.find((item) => item.name === "Settings")
                        ?.route
                    }
                    onClick={() => setIsDialogOpen(false)}
                  >
                    <div className="flex items-center gap-2 pl-4 py-3 md:py-4 active:bg-gray-800 rounded-lg">
                      <span>
                        {
                          NavElements.find((item) => item.name === "Settings")
                            ?.icon
                        }{" "}
                      </span>
                      <span>Settings</span>
                    </div>
                  </NavLink>

                  <li
                    onClick={handleLogout}
                    className="py-3 md:py-4 transition-all duration-100 cursor-pointer flex items-center pl-4 active:bg-gray-800 rounded-lg bg-[#2a2a2a]"
                  >
                    <span>
                      <IoIosLogOut className="w-7 h-6 mr-2" />
                    </span>
                    Logout
                  </li>
                </ul>

                <hr className="mx-5 my-2 opacity-0" />
              </>
            )}

            {/* help , send feedback */}

            <ul className="text-xl text-[#ffffffb3]">
              {NavElements.filter(
                (item) =>
                  ["Help", "Send Feedback"].includes(item.name) &&
                  (!item.requiresAuth || authStatus)
              ).map((item, index) => (
                <NavLink
                  className={`block hover:text-[#00bfffd2] ${
                    index % 2 === 0
                      ? "bg-[#3a3a3a]"
                      : "bg-[#2a2a2a] rounded-br-3xl rounded-bl-3xl"
                  }`}
                  to={item.route}
                  key={index}
                  onClick={() => setIsDialogOpen(false)}
                >
                  <div className="flex items-center gap-2 pl-4 py-3 md:py-4 active:bg-gray-800 rounded-bl-3xl rounded-br-3xl">
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                </NavLink>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
