import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import getUserVideos from "../../hooks/getUserVideos.js";
import ChannelEmptyVideo from "./ChannelEmptyVideo.jsx";
import { icons } from "../Icons.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import { removeUserVideo } from "../../store/userSlice.js";
import VideoCard from "../Video/VideoCard.jsx";
import VideoPanel from "./VideoPanel.jsx";
import getChannelVideos from "../../hooks/getChannelVideos.js";
import getUserProfile from "../../hooks/getUserProfile.js";

function ChannelVideos() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortType, setSortType] = useState("desc");
  const dispatch = useDispatch();
  const { username } = useParams();
  const userId = useSelector((state) => state.user.user._id);
  const { status, userData } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [isVideoPanel, setIsVideoPanel] = useState(false);

  useEffect(() => {
    if (page === 1) {
      dispatch(removeUserVideo());
    }
    getUserVideos(dispatch, userId, sortType, page).then((res) => {
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
                <FiVideoOff className="w-28 h-28" />
              </span>
            }
            guest={false}
          />
        );
      }
    });
  }, [status, username]);

  const videos = useSelector((state) => state.user.userVideo);

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (loading) {
    return (
      <span className="flex justify-center mt-20">{icons.bigLoading}</span>
    );
  }

  return videos && videos?.length < 1 ? (
    <ChannelEmptyVideo />
  ) : (
    <div className="overflow-auto mt-2">
      <InfiniteScroll
        dataLength={videos.length}
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
          className={`grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-2 ${
            videos?.length < 4 &&
            "sm:grid-cols-[repeat(auto-fit,_minmax(300px,0.34fr))] 2xl:grid-cols-[repeat(auto-fit,_minmax(300px,0.24fr))]"
          }`}
        >
          {videos?.map((video) => (
            <VideoCard
              key={video?._id}
              video={video}
              name={false}
              displayAvatar={false}
            />
          ))}
        </div>
      </InfiniteScroll>

      {/* video control table */}
      {status === true && userData?.username === profile?.username && (
        <button
          onClick={() => setIsVideoPanel(true)}
          className="fixed bottom-16 right-2 md:bottom-20 md:right-8 lg:bottom-6 lg:right-6 p-4 flex justify-center items-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] active:scale-95 border-none rounded-xl z-20 hover:transition duration-1000 font-bold text-gray-100"
        >
          VIDEO CONTROLS
        </button>
      )}

      {isVideoPanel && (
        <VideoPanel channelVideos={videos} setIsVideoPanel={setIsVideoPanel} />
      )}
    </div>
  );
}

export default ChannelVideos;
