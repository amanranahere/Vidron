import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoginPopup from "../Auth/LoginPopup.jsx";
import { AiFillLike } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios.helper.js";
import { setSnap } from "../../store/snapSlice.js";

const SnapPlayer = ({
  snapFile,
  snap,
  onToggle,
  showSnapInfo,
  showMoreSnaps,
}) => {
  const authStatus = useSelector((state) => state.auth.status);
  const LoginLikePopupDialog = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return (
    <div className="relative md:aspect-[9/16] md:rounded-[20px] group h-full">
      {/* black bg */}
      <div className="absolute hidden group-hover:block inset-0 bg-gradient-to-b from-black/70 to-transparent"></div>

      {/* title */}
      <div className="z-40 absolute w-4/5 left-2 top-3 hidden group-hover:block text-xl text-shadow-lg ">
        {snap.title}
      </div>

      {/* more snaps button */}
      {showMoreSnaps && (
        <button
          onClick={() => navigate("/snaps")}
          className="z-10 absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-[#1a1a1a] hover:bg-[#fff] hover:text-black px-4 py-2 rounded-full text-white font-semibold bg-opacity-70"
        >
          More Snaps
        </button>
      )}

      {/* back button */}
      <button
        onClick={() => navigate("/")}
        className="md:hidden z-30 absolute right-2 top-40 bg-[#1a1a1a] hover:bg-[#fff] hover:text-black p-3 rounded-full bg-opacity-50"
      >
        <p>
          <IoMdArrowRoundBack className="w-7 h-7" />
        </p>
      </button>

      {/* toggle info */}
      <label className="hamburger z-30 absolute top-2 right-2 transition duration-400">
        <input type="checkbox" checked={showSnapInfo} onChange={onToggle} />
        <svg viewBox="0 0 32 32">
          <path
            className="line line-top-bottom"
            d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
          ></path>
          <path className="line" d="M7 16 27 16"></path>
        </svg>
      </label>

      {/* like button */}
      <div className="">
        <LoginPopup
          ref={LoginLikePopupDialog}
          message="Login to Like this Snap..."
          route={location.pathname}
        />
        <button
          onClick={() => toggleSnapLike()}
          className="z-30 absolute right-2 top-20 bg-[#1a1a1a] hover:bg-[#fff] hover:text-black p-3 rounded-full bg-opacity-50 transition duration-200 active:scale-75"
        >
          <p>
            <AiFillLike className="w-7 h-7" />
          </p>
        </button>
      </div>

      {/* snap video */}
      <video
        className="md:rounded-[20px] aspect-[9/16] object-cover"
        controls
        autoPlay
        loop
      >
        <source src={snapFile} type="video/mp4" />
      </video>
    </div>
  );
};

export default SnapPlayer;
