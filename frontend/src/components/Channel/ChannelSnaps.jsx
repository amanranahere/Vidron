import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { FaUserAltSlash } from "react-icons/fa";
import getUserSnaps from "../../hooks/getUserSnaps.js";
import ChannelEmptySnap from "./ChannelEmptySnap.jsx";
import { icons } from "../Icons.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import { removeUserSnaps } from "../../store/userSlice.js";
import SnapCard from "../Snap/SnapCard.jsx";
import SnapPanel from "./SnapPanel.jsx";
import getUserProfile from "../../hooks/getUserProfile.js";

function ChannelSnaps() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortType, setSortType] = useState("desc");
  const dispatch = useDispatch();
  const { username } = useParams();
  const userId = useSelector((state) => state.user.user._id);
  const { status, userData } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [isSnapPanel, setIsSnapPanel] = useState(false);

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

  useEffect(() => {
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

  const snaps = useSelector((state) => state.user.userSnaps);

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
        <div className="flex mx-2 mb-2">
          <button
            type="button"
            className={`mr-3 font-semibold ${
              sortType === "desc" ? "text-white " : "text-[#6a6a6a]"
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
            className={`font-semibold ${
              sortType === "asc" ? "text-white " : "text-[#6a6a6a]"
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
          className={`h-full px-2 grid grid-cols-[repeat(auto-fit,_minmax(100px,1fr))] 
          md:grid-cols-[repeat(auto-fit,_minmax(150px,1fr))] 
          lg:grid-cols-[repeat(auto-fit,_minmax(200px,1fr))] 
          gap-1 
          grid-auto-rows-[minmax(200px,_auto)] ${
            snaps.length <= 2 ? "w-[25%]" : ""
          }`}
        >
          {snaps?.map((snap) => (
            <SnapCard key={snap?._id} snap={snap} />
          ))}
        </div>
      </InfiniteScroll>

      {/* snap control table */}
      {status === true && userData?.username === profile?.username && (
        <button
          onClick={() => setIsSnapPanel(true)}
          className="fixed bottom-16 right-2 md:bottom-20 md:right-8 lg:bottom-6 lg:right-6 p-4 flex justify-center items-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] active:scale-95 border-none rounded-xl z-20 hover:transition duration-1000 font-bold text-gray-100"
        >
          SNAP CONTROLS
        </button>
      )}

      {isSnapPanel && (
        <SnapPanel channelSnaps={snaps} setIsSnapPanel={setIsSnapPanel} />
      )}
    </div>
  );
}

export default ChannelSnaps;
