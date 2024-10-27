import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserSnaps } from "../../hooks/getUserSnaps.js";
import ChannelEmptySnap from "./ChannelEmptySnap.jsx";
import { icons } from "../Icons.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import { removeUserSnaps } from "../../store/userSlice.js";
// import SnapCard from "../Snap/SnapCard.jsx";

function ChannelSnaps() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortType, setSortType] = useState("desc");
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.user._id);

  useEffect(() => {
    if (page === 1) {
      dispatch(removeUserSnaps());
    }

    getUserSnaps(dispatch, userId, sortType, page).then((res) => {
      setLoading(false);
      if (res.data.length !== 10) {
        setHasMore(false);
      }
    });
  }, [userId, sortType, page]);

  const snaps = useSelector((state) => state.user.userVideo);

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (loading) {
    return (
      <span className="flex justify-center mt-20">{icons.bigLoading}</span>
    );
  }

  return snaps && snaps?.length < 1 ? (
    <ChannelEmptySnap />
  ) : (
    <div className="overflow-auto mt-2">
      <InfiniteScroll
        dataLength={snaps.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center h-7 mt-1">{icons.loading}</div>
        }
        scrollableTarget="scrollableDiv"
      >
        <div className="flex mx-2">
          <button
            type="button"
            className={`px-3 py-1.5 mr-3 text-sm rounded-lg font-semibold ${
              sortType === "desc" ? "bg-pink-500 " : "bg-slate-700"
            }`}
            onClick={() => {
              setSortType("desc");
              setPage(1);
              setLoading(true);
            }}
          >
            Latest
          </button>

          <button
            type="button"
            className={`px-3 py-1.5 text-sm rounded-lg font-semibold ${
              sortType === "asc" ? "bg-pink-500 " : "bg-slate-700 "
            }`}
            onClick={() => {
              setSortType("asc");
              setPage(1);
              setLoading(true);
            }}
          >
            Oldest
          </button>
        </div>

        <div
          className={`grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-2 ${
            snaps?.length < 4 &&
            "sm:grid-cols-[repeat(auto-fit,_minmax(300px,0.34fr))] 2xl:grid-cols-[repeat(auto-fit,_minmax(300px,0.24fr))]"
          }`}
        >
          {snaps?.map((snap) => (
            <SnapCard key={snap?._id} snap={snap} name={false} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default ChannelSnaps;
