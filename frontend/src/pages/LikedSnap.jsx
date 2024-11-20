import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import getUserLikedSnaps from "../hooks/getUserLikedSnaps.js";
import SnapListCard from "../components/Snap/SnapListCard.jsx";
import { BiLike } from "react-icons/bi";
import { icons } from "../components/Icons.jsx";
import GuestLikedContent from "../components/GuestPages/GuestLikedContent.jsx";
import GuestComponent from "../components/GuestPages/GuestComponent.jsx";
import { removeUserLikedSnaps } from "../store/userSlice.js";
import InfiniteScroll from "react-infinite-scroll-component";

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
        if (res.data.length !== 10) {
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
    <>
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
          {likedSnaps.map((snap) => (
            <div key={snap._id}>
              <SnapListCard
                snap={snap}
                imgWidth="w-[20vw]"
                imgHeight="h-[11vw]"
              />
            </div>
          ))}
        </InfiniteScroll>
      )}

      {likedSnaps?.length < 1 && !loading && (
        <GuestComponent
          icon={
            <span className="w-full h-full flex items-center p-4 pb-5">
              <BiLike className="w-32 h-32" />
            </span>
          }
          title="Empty Liked Snaps"
          subtitle="You have no previously liked snaps"
          guest={false}
        />
      )}
    </>
  );
}

export default LikedSnaps;
