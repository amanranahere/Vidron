import React, { useEffect, useState } from "react";
import { FaVideo } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";
import { icons } from "../Icons.jsx";
import axiosInstance from "../../utils/axios.helper.js";
import VideoCard from "./VideoCard.jsx";

function VideoContainer() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const getData = async (page) => {
    try {
      const response = await axiosInstance.get(
        `/videos?skip=${6 + (page - 1) * limit}&limit=20`
      );

      if (response?.data?.videos?.length > 0) {
        setVideos(response.data.videos);
        setLoading(false);
        if (response.data.videos.length !== 20) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log("Error fetching videos", error);
    }
  };

  useEffect(() => {
    getData(page);
  }, [page]);

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // if (loading) {
  //   return (
  //     <span className="flex justify-center mt-20">{icons.bigLoading}</span>
  //   );
  // }

  return (
    <div className="overflow-auto">
      <InfiniteScroll
        dataLength={videos.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center h-10 mt-1">{icons.loading}</div>
        }
        scrollableTarget="scrollableDiv"
      >
        <div className="overflow-hidden mb-2 mx-2">
          <div
            className={`grid grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))] md:grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] lg:grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))] gap-2 ${
              videos.length < 3 &&
              "sm:grid-cols-[repeat(auto-fit,_minmax(400px,0.34fr))] 2xl:grid-cols-[repeat(auto-fit,_minmax(300px,0.24fr))]"
            }`}
          >
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default VideoContainer;
