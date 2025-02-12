import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import getUserVideoHistory from "../hooks/getUserVideoHistory.js";
import getUserSnapHistory from "../hooks/getUserSnapHistory.js";
import VideoListCard from "../components/Video/VideoListCard.jsx";
import GuestComponent from "../components/GuestPages/GuestComponent.jsx";
import GuestHistory from "../components/GuestPages/GuestHistory.jsx";
import {
  removeUserVideoHistory,
  removeUserSnapHistory,
} from "../store/userSlice.js";
import { GoHistory } from "react-icons/go";
import { icons } from "../components/Icons.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import SnapCard from "../components/Snap/SnapCard.jsx";

function History() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);
  const [showVideos, setShowVideos] = useState(true);
  const [showSnaps, setShowSnaps] = useState(false);

  useEffect(() => {
    if (status) {
      if (page === 1) {
        dispatch(removeUserVideoHistory());
        dispatch(removeUserSnapHistory());
      }
      getUserVideoHistory(dispatch, page).then((res) => {
        setLoading(false);
        if (res.data.length !== 10) {
          setHasMore(false);
        }
      });
      getUserSnapHistory(dispatch, page).then((res) => {
        setLoading(false);
        if (res.data.length !== 10) {
          setHasMore(false);
        }
      });
    }
  }, [status, page]);

  const videoHistory = useSelector((state) => state.user.userVideoHistory);

  const snapHistory = useSelector((state) => state.user.userSnapHistory);

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (!status) {
    return <GuestHistory />;
  }

  return (
    <div className="">
      {loading && (
        <span className="flex justify-center mt-20">{icons.bigLoading}</span>
      )}

      <div className="w-full flex gap-5 font-bold text-2xl md:text-3xl px-4 py-2 pb-3">
        <button
          onClick={() => {
            setShowVideos(true);
            setShowSnaps(false);
          }}
          className={`${
            showVideos ? "text-white" : "text-[#6a6a6a] hover:text-[#9a9a9a]"
          }`}
        >
          Videos
        </button>

        <button
          onClick={() => {
            setShowSnaps(true);
            setShowVideos(false);
          }}
          className={`${
            showSnaps ? "text-white" : "text-[#6a6a6a] hover:text-[#9a9a9a]"
          }`}
        >
          Snaps
        </button>
      </div>

      {/* videos */}

      {showVideos && (
        <div className="w-full lg:w-3/4 h-full pb-20 lg:pb-0">
          {videoHistory?.length > 0 && !loading && (
            <InfiniteScroll
              dataLength={videoHistory.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                <div className="flex justify-center h-7 mt-1">
                  {icons.loading}
                </div>
              }
              scrollableTarget="scrollableDiv"
            >
              {videoHistory.map((video) => (
                <div key={video._id}>
                  <VideoListCard video={video} />
                </div>
              ))}
            </InfiniteScroll>
          )}

          {videoHistory?.length < 1 && !loading && (
            <GuestComponent
              icon={
                <span className="w-full h-full flex items-center p-4 pb-5">
                  <GoHistory className="w-32 h-32" />
                </span>
              }
              title="Empty Video History"
              subtitle="You have no previously saved video history"
              guest={false}
            />
          )}
        </div>
      )}

      {/* snaps */}

      {showSnaps && (
        <div className="w-full h-full pb-16 lg:pb-12">
          {snapHistory?.length > 0 && !loading && (
            <InfiniteScroll
              dataLength={snapHistory.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                <div className="flex justify-center h-7 mt-1">
                  {icons.loading}
                </div>
              }
              scrollableTarget="scrollableDiv"
            >
              <div
                className={`h-full px-2 grid grid-cols-[repeat(auto-fit,_minmax(100px,1fr))] 
                md:grid-cols-[repeat(auto-fit,_minmax(150px,1fr))] 
                lg:grid-cols-[repeat(auto-fit,_minmax(200px,1fr))] 
                gap-1 
                grid-auto-rows-[minmax(200px,_auto)] ${
                  snapHistory.length <= 2 ? "w-[25%]" : ""
                }`}
              >
                {snapHistory.map((snap) => (
                  <div key={snap._id}>
                    <SnapCard snap={snap} />
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          )}

          {snapHistory?.length < 1 && !loading && (
            <GuestComponent
              icon={
                <span className="w-full h-full flex items-center p-4 pb-5">
                  <GoHistory className="w-32 h-32" />
                </span>
              }
              title="Empty Snap History"
              subtitle="You have no previously saved snap history"
              guest={false}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default History;
