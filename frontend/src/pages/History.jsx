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

function History() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);

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
  console.log("videoHistory : ", videoHistory);

  const snapHistory = useSelector((state) => state.user.userSnapHistory);
  console.log("snapHistory : ", snapHistory);

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (!status) {
    return <GuestHistory />;
  }

  return (
    <>
      {loading && (
        <span className="flex justify-center mt-20">{icons.bigLoading}</span>
      )}
      <div>
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
                <VideoListCard
                  video={video}
                  imgWidth="w-[20vw]"
                  imgHeight="h-[11vw]"
                />
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
            subtitle="You have no previously saved videoHistory"
            guest={false}
          />
        )}
      </div>

      <div className="bg-gray-900">
        <h1 className="bg-gray text-center text-3xl py-5">Snaps</h1>
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
            {snapHistory.map((video) => (
              <div key={video._id}>
                <VideoListCard
                  video={video}
                  imgWidth="w-[20vw]"
                  imgHeight="h-[11vw]"
                />
              </div>
            ))}
          </InfiniteScroll>
        )}

        {snapHistory?.length < 1 && !loading && (
          <GuestComponent
            icon={
              <span className="w-full h-full flex items-center p-4 pb-5">
                <GoHistory className="w-32 h-32" />
              </span>
            }
            title="Empty Video History"
            subtitle="You have no previously saved snapHistory"
            guest={false}
          />
        )}
      </div>
    </>
  );
}

export default History;
