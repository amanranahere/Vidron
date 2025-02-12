import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import getUserLikedSnaps from "../hooks/getUserLikedSnaps.js";
import { AiOutlineLike } from "react-icons/ai";
import { icons } from "../components/Icons.jsx";
import GuestLikedContent from "../components/GuestPages/GuestLikedContent.jsx";
import GuestComponent from "../components/GuestPages/GuestComponent.jsx";
import { removeUserLikedSnaps } from "../store/userSlice.js";
import InfiniteScroll from "react-infinite-scroll-component";
import SnapCard from "../components/Snap/SnapCard.jsx";

function LikedSnaps() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (status) {
      if (page === 1) {
        dispatch(removeUserLikedSnaps());
      }
      getUserLikedSnaps(dispatch, page).then((res) => {
        setLoading(false);
        const snaps = res?.data || [];
        if (snaps.length !== 10) {
          setHasMore(false);
        }
      });
    }
  }, [status, page]);

  const likedSnaps = useSelector((state) => state.user.userLikedSnaps);
  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (!status) {
    return <GuestLikedContent content={"snaps"} />;
  }

  return (
    <div className="pb-20 lg:pb-0">
      <div className="w-full text-2xl md:text-3xl font-bold px-4 py-2 pb-3">
        Liked Snaps
      </div>

      {loading && (
        <span className="flex justify-center mt-20">{icons.bigLoading}</span>
      )}

      {likedSnaps?.length > 0 && !loading && (
        <InfiniteScroll
          dataLength={likedSnaps.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center h-7 mt-1">{icons.loading}</div>
          }
          scrollableTarget="scrollableDiv"
        >
          <div
            className={`h-full px-2 grid grid-cols-[repeat(auto-fit,_minmax(100px,1fr))] 
              md:grid-cols-[repeat(auto-fit,_minmax(150px,1fr))] 
              lg:grid-cols-[repeat(auto-fit,_minmax(200px,1fr))] 
              gap-1 
              grid-auto-rows-[minmax(200px,_auto)] ${
                likedSnaps.length <= 2 ? "w-[25%]" : ""
              }`}
          >
            {likedSnaps.map((snap) => (
              <div key={snap._id}>
                <SnapCard snap={snap} />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}

      {likedSnaps?.length < 1 && !loading && (
        <GuestComponent
          icon={
            <span className="w-full h-full flex items-center p-4 pb-5">
              <AiOutlineLike className="w-32 h-32" />
            </span>
          }
          title="Empty Liked Snaps"
          subtitle="You have no previously liked snaps"
          guest={false}
        />
      )}
    </div>
  );
}

export default LikedSnaps;
