import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios.helper.js";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setSnap } from "../store/snapSlice.js";
import SnapPlayer from "../components/Snap/SnapPlayer.jsx";
import SnapListCard from "../components/Snap/SnapListCard.jsx";
import SnapInfo from "../components/Snap/SnapInfo.jsx";
import Comments from "../components/SnapsComments.jsx";
import GuestComponent from "../components/GuestPages/GuestComponent.jsx";
import { IoPlayCircleOutline } from "react-icons/io5";
import { icons } from "../components/Icons.jsx";

function Snap() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { snapId } = useParams();
  const [snaps, setSnaps] = useState([]);
  const { snap } = useSelector((state) => state.snap);
  const authStatus = useSelector((state) => state.auth.status);
  const [showSnapInfo, setShowSnapInfo] = useState(false);

  const toggleSnapInfo = () => {
    setShowSnapInfo((prev) => !prev);
  };

  const fetchSnap = async (data) => {
    setError("");
    try {
      const response = await axiosInstance.get(`/snaps/${snapId}`);
      if (response?.data?.data) {
        dispatch(setSnap(response.data.data));
      }
    } catch (error) {
      setError(
        <GuestComponent
          title="Snap does not exist"
          subtitle="There is no snap present for given snapId. It may have been moved or deleted."
          icon={
            <span className="w-full h-full flex items-center p-4">
              <IoPlayCircleOutline className="w-28 h-28" />
            </span>
          }
          guest={false}
        />
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSnaps = async () => {
    try {
      const response = await axiosInstance.get(`/snaps?sortBy=views&limit=8`);

      if (response?.data?.data?.snaps?.length > 0) {
        setSnaps(response.data.data.snaps);
      }
    } catch (error) {
      console.log("Error fetching snaps", error);
    }
  };

  useEffect(() => {
    fetchSnap();
    fetchSnaps();
  }, [snapId, authStatus]);

  if (error) {
    return error;
  }

  return (
    <div>
      {loading ? (
        <span className="flex justify-center mt-20">{icons.bigLoading}</span>
      ) : (
        <div className="flex justify-center h-[calc(100vh-56px)] md:h-[calc(100vh-112px)] lg:h-[calc(100vh-56px)]">
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
                className={`flex justify-center items-center ${
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
                <div className="min-w-96 w-full fixed top-40 md:top-52 px-2 md:px-4 flex-col lg:static lg:w-2/5 slide-up">
                  <SnapInfo snap={snap} />
                </div>
              )}

              {/* lg screen size */}
              {window.innerWidth >= 1024 && (
                <div className="min-w-96 w-full fixed top-40 md:top-52 px-4 flex-col lg:static lg:w-2/5 fade-in">
                  <SnapInfo snap={snap} />
                </div>
              )}
            </>
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
