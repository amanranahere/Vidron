import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios.helper.js";
import { useSelector, useDispatch } from "react-redux";
import { setSnap } from "../store/snapSlice.js";
import SnapPlayer from "../components/Snap/SnapPlayer.jsx";
import SnapInfo from "../components/Snap/SnapInfo.jsx";
import GuestComponent from "../components/GuestPages/GuestComponent.jsx";
import { IoPlayCircleOutline, IoArrowUp, IoArrowDown } from "react-icons/io5";
import { icons } from "../components/Icons.jsx";

function Snap({
  snapId,
  handleUpButtonClick,
  handleDownButtonClick,
  disableUp,
  disableDown,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [snaps, setSnaps] = useState([]);
  // const authStatus = useSelector((state) => state.auth.status);
  const [showSnapInfo, setShowSnapInfo] = useState(false);
  const [snap, setSnapData] = useState(null);

  const toggleSnapInfo = () => {
    setShowSnapInfo((prev) => !prev);
  };

  const fetchSnap = async () => {
    setError("");
    try {
      const response = await axiosInstance.get(`/snaps/${snapId}`);
      if (response?.data?.data) {
        const snapData = response.data.data;
        setSnapData(snapData);
        dispatch(setSnap(snapData));
      }
    } catch (error) {
      setError(
        <GuestComponent
          title="Snap does not exist"
          subtitle="There is no snap present for the given snapId. It may have been moved or deleted."
          icon={
            <span className="w-full h-full flex items-center p-4">
              <IoPlayCircleOutline className="w-28 h-28" />
            </span>
          }
          guest={false}
        />
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnap();
  }, [snapId]);

  if (error) {
    return error;
  }

  return (
    <div className="flex justify-center items-center">
      {loading ? (
        <span className="flex justify-center items-center h-[calc(100vh-56px)] md:h-[calc(100vh-112px)] lg:h-[calc(100vh-56px)] md:aspect-[9/16] md:rounded-[20px] md:bg-[#2a2a2a]">
          {icons.bigLoading}
        </span>
      ) : (
        <div className="flex justify-center md:h-[calc(100vh-56px)]">
          {/* snap video */}
          <>
            {/* sm and md screen size */}
            {window.innerWidth < 1024 && (
              <div className="flex justify-center items-center">
                <SnapPlayer
                  key={snap._id}
                  snapFile={snap.snapFile}
                  snap={snap}
                  onToggle={toggleSnapInfo}
                  showSnapInfo={showSnapInfo}
                />
              </div>
            )}

            {/* lg screen size */}
            {window.innerWidth >= 1024 && (
              <div
                className={`z-10 flex justify-center items-center ${
                  showSnapInfo ? "slide-left" : ""
                }`}
              >
                <SnapPlayer
                  key={snap._id}
                  snapFile={snap.snapFile}
                  snap={snap}
                  onToggle={toggleSnapInfo}
                  showSnapInfo={showSnapInfo}
                />
              </div>
            )}
          </>

          {/* snap info */}
          {showSnapInfo && (
            <>
              {/* sm and md screen sizes */}
              {window.innerWidth < 1024 && (
                <div className="min-w-96 w-full fixed top-40 md:top-52 px-2 md:px-4 flex-col lg:static lg:w-[45%] slide-up">
                  <SnapInfo snap={snap} />
                </div>
              )}

              {/* lg screen size */}
              {window.innerWidth >= 1024 && (
                <div className="min-w-96 w-full fixed top-40 md:top-52 px-4 flex-col lg:static lg:w-[45%] fade-in">
                  <SnapInfo snap={snap} />
                </div>
              )}
            </>
          )}

          {/* prev and next button */}
          {!showSnapInfo && (
            <div className="hidden lg:block">
              <div className="absolute top-[38%] right-10 z-40 p-2">
                <button
                  onClick={handleUpButtonClick}
                  disabled={disableUp}
                  className="bg-[#2a2a2a] text-white/90 p-3 rounded-full hover:bg-[#3a3a3a] cursor-pointer active:bg-[#2a2a2a]"
                >
                  <IoArrowUp className="w-9 h-9" />
                </button>
              </div>

              <div className="absolute bottom-[38%] right-10 z-40 p-2">
                <button
                  onClick={handleDownButtonClick}
                  disabled={disableDown}
                  className="bg-[#2a2a2a] text-white/90 p-3 rounded-full hover:bg-[#3a3a3a] cursor-pointer active:bg-[#2a2a2a]"
                >
                  <IoArrowDown className="w-9 h-9" />
                </button>
              </div>
            </div>
          )}
        </div>

        // <div className="flex">
        //   <div className="w-[70%] p-4">

        //     {/* <div>
        //       <Comments snap={snap} />
        //     </div> */}
        //   </div>

        //   {/* <div className="w-[30%]">
        //     {snaps
        //       ?.filter((snap) => snap?._id !== snapId)
        //       .map((snap) => (
        //         <SnapListCard
        //           key={snap?._id}
        //           snap={snap}
        //           imgWidth="w-[13vw]"
        //           imgHeight="h-[8vw]"
        //           titleWidth="w-[95%]"
        //           titleSize="text-[0.95rem]"
        //           titleFont=""
        //           showSnapDescription={false}
        //           paddingY="py-1"
        //           marginLeft="ml-2"
        //           marginLeft2="ml-2"
        //           avatarHeight="h-7"
        //           avatarWidth="w-7"
        //           textFont="text-[0.9rem]"
        //         />
        //       ))}
        //   </div> */}
        // </div>
      )}
    </div>
  );
}

export default Snap;
