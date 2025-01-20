import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axios.helper.js";
import VideoListCard from "../components/Video/VideoListCard.jsx";
import GuestComponent from "../components/GuestPages/GuestComponent.jsx";
import { IoPlayOutline } from "react-icons/io5";
import { icons } from "../components/Icons.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import SnapCard from "../components/Snap/SnapCard.jsx";

function Search() {
  const [videos, setVideos] = useState([]);
  const [snaps, setSnaps] = useState([]);
  const [page, setPage] = useState(1);
  const [snapsPage, setSnapsPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [snapsHasMore, setSnapsHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState("videos");
  const { query } = useParams();
  const [prevQuery, setPrevQuery] = useState("");

  const fetchData = async (type, page) => {
    setError(null);
    const endpoint = type === "videos" ? `/videos` : `/snaps`;

    try {
      const response = await axiosInstance.get(
        `${endpoint}?query=${query}&page=${page}&limit=50`
      );
      const results =
        type === "videos" ? response.data.videos : response.data.data.snaps;

      if (results.length > 0) {
        if (type === "videos") {
          setVideos((prev) => [
            ...prev,
            ...results.filter(
              (newItem) =>
                !prev.some((existingItem) => existingItem._id === newItem._id)
            ),
          ]);
          if (results.length < 50) setHasMore(false);
        } else {
          setSnaps((prev) => [
            ...prev,
            ...results.filter(
              (newItem) =>
                !prev.some((existingItem) => existingItem._id === newItem._id)
            ),
          ]);
          if (results.length < 50) setSnapsHasMore(false);
        }
      } else if (page === 1) {
        setError(
          <p className="flex text-[#7a7a7a] text-xl font-bold justify-center mt-20 mx-4 text-center">
            Sorry, no {type} matched your search for "{query}"
          </p>
        );
        if (type === "videos") setHasMore(false);
        else setSnapsHasMore(false);
      }
    } catch (err) {
      setError(
        <p className="flex text-xl text-[#7a7a7a] font-bold justify-center mt-20 mx-4 text-center">
          Sorry, no {type} matched your search for "{query}"
        </p>
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query !== prevQuery) {
      setLoading(true);
      setPrevQuery(query);
      setVideos([]);
      setSnaps([]);
      setPage(1);
      setSnapsPage(1);
      setHasMore(true);
      setSnapsHasMore(true);
      fetchData(searchType, 1);
    }
  }, [query]);

  useEffect(() => {
    if (page > 1 && searchType === "videos") {
      fetchData("videos", page);
    }
  }, [page]);

  useEffect(() => {
    if (snapsPage > 1 && searchType === "snaps") {
      fetchData("snaps", snapsPage);
    }
  }, [snapsPage]);

  useEffect(() => {
    setLoading(true);
    setVideos([]);
    setSnaps([]);
    setPage(1);
    setSnapsPage(1);
    setHasMore(true);
    setSnapsHasMore(true);
    fetchData(searchType, 1);
  }, [searchType]);

  const fetchMoreData = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const fetchMoreSnapsData = () => {
    if (snapsHasMore) {
      setSnapsPage((prevPage) => prevPage + 1);
    }
  };

  const buttonClass = (active) =>
    active ? "text-white" : "text-[#6a6a6a] hover:text-[#9a9a9a]";

  return (
    <>
      <div className="w-full flex gap-5 font-bold text-2xl md:text-3xl px-4 py-2 pb-3">
        <button
          onClick={() => setSearchType("videos")}
          className={buttonClass(searchType === "videos")}
        >
          Videos
        </button>
        <button
          onClick={() => setSearchType("snaps")}
          className={buttonClass(searchType === "snaps")}
        >
          Snaps
        </button>
      </div>

      <div className="pb-16 pt-4 px-2">
        {loading ? (
          <span className="flex justify-center mt-20">{icons.bigLoading}</span>
        ) : error ? (
          error
        ) : (
          <InfiniteScroll
            dataLength={searchType === "videos" ? videos.length : snaps.length}
            next={searchType === "videos" ? fetchMoreData : fetchMoreSnapsData}
            hasMore={searchType === "videos" ? hasMore : snapsHasMore}
            loader={
              <div className="flex justify-center h-full mt-1">
                {icons.loading}
              </div>
            }
            scrollableTarget="scrollableDiv"
          >
            {searchType === "videos" ? (
              videos.map((video) => (
                <div key={video._id}>
                  <VideoListCard video={video} />
                </div>
              ))
            ) : (
              <div
                className={` grid grid-cols-[repeat(auto-fit,_minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,_minmax(150px,1fr))] lg:grid-cols-[repeat(auto-fit,_minmax(200px,1fr))] gap-1 grid-auto-rows-[minmax(200px,_auto)] ${
                  snaps.length === 1 ? "w-[40%] md:w-[40%] lg:w-[20%]" : ""
                } ${snaps.length === 2 ? "lg:w-[40%]" : ""} ${
                  snaps.length === 3 ? "lg:w-[60%]" : ""
                }`}
              >
                {snaps.map((snap) => (
                  <div key={snap._id}>
                    <SnapCard snap={snap} />
                  </div>
                ))}
              </div>
            )}
          </InfiniteScroll>
        )}
      </div>
    </>
  );
}

export default Search;
