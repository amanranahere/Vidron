import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios.helper.js";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSnap } from "../store/snapSlice.js";
import SnapPlayer from "../components/Snap/SnapPlayer.jsx";
import SnapInfo from "../components/Snap/SnapInfo.jsx";
import GuestComponent from "../components/GuestPages/GuestComponent.jsx";
import { BiFilm } from "react-icons/bi";
import { icons } from "../components/Icons.jsx";

function SingleSnap() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { snapId } = useParams();
  const { snap } = useSelector((state) => state.snap);
  const [showSnapInfo, setShowSnapInfo] = useState(false);
  const [showMoreSnaps, setShowMoreSnaps] = useState(true);

  const toggleSnapInfo = () => {
    setShowSnapInfo((prev) => !prev);
  };

  const fetchSnap = async () => {
    setError("");
    try {
      const response = await axiosInstance.get(`/snaps/${snapId}`);
      if (response?.data?.data) {
        const snapData = response.data.data;
        dispatch(setSnap(snapData));
      }
    } catch (error) {
      setError(
        <GuestComponent
          title="Snap does not exist"
          subtitle="There is no snap present for the given snapId. It may have been moved or deleted."
          icon={
            <span className="w-full h-full flex items-center p-4">
              <BiFilm className="w-28 h-28" />
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
                  showMoreSnaps={showMoreSnaps}
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
                  showMoreSnaps={showMoreSnaps}
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
        </div>
      )}
    </div>
  );
}

export default SingleSnap;
