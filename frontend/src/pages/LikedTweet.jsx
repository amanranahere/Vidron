import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "../components/Icons.jsx";
import Tweet from "../components/Tweet/TweetCard.jsx";
import GuestComponent from "../components/GuestPages/GuestComponent.jsx";
import { BiLike } from "react-icons/bi";

import InfiniteScroll from "react-infinite-scroll-component";
import { removeUserLikedTweets } from "../store/userSlice.js";
import getUserLikedTweets from "../hooks/getUserLikedTweets.js";
import GuestLikedContent from "../components/GuestPages/GuestLikedContent.jsx";

function LikedTweets() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (status) {
      if (page === 1) {
        dispatch(removeUserLikedTweets());
      }
      getUserLikedTweets(dispatch, page).then((res) => {
        setLoading(false);
        const tweets = res?.data || [];
        if (tweets.length !== 20) {
          setHasMore(false);
        }
      });
    }
  }, [status, page]);

  const likedTweets = useSelector((state) => state.user.userLikedTweets);

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (!status) {
    return <GuestLikedContent content={"tweets"} />;
  }

  return (
    <>
      {loading && (
        <span className="flex justify-center mt-20">{icons.bigLoading}</span>
      )}

      {likedTweets?.length > 0 && !loading && (
        <InfiniteScroll
          dataLength={likedTweets.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center h-7 mt-1">{icons.loading}</div>
          }
          scrollableTarget="scrollableDiv"
        >
          <ul className="py-4 px-4">
            {likedTweets.map((tweet, index) => (
              <Tweet key={tweet._id || index} tweet={tweet} page={true} />
            ))}
          </ul>
        </InfiniteScroll>
      )}

      {likedTweets?.length < 1 && !loading && (
        <GuestComponent
          icon={
            <span className="w-full h-full flex items-center p-4 pb-5">
              <BiLike className="w-32 h-32" />
            </span>
          }
          title="Empty Liked tweets"
          subtitle="You have no previously liked tweets"
          guest={false}
        />
      )}
    </>
  );
}

export default LikedTweets;
