import React, { useState, useEffect } from "react";
import { BiFilm } from "react-icons/bi";
import InfiniteScroll from "react-infinite-scroll-component";
import { icons } from "../components/Icons.jsx";
import axiosInstance from "../utils/axios.helper";
import SnapCard from "../components/Snap/SnapCard.jsx";

function AllSnaps() {
  const [snaps, setSnaps] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState("views");
  const [sortType, setSortType] = useState("-1");

  const getData = async (page) => {
    try {
      const response = await axiosInstance.get(
        `/snaps?sortBy=${sortBy}&sortType=${sortType}&limit=20`
      );

      if (response?.data?.data?.snaps?.length > 0) {
        setSnaps(response.data.data.snaps);
        setLoading(false);
        if (response.data.data.snaps.length !== 20) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log("Error fetching snaps", error);
    }
  };

  useEffect(() => {
    getData(page);
  }, [page, sortBy, sortType]);

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (loading) {
    return (
      <span className="flex justify-center items-center h-[90%] w-full">
        {icons.bigLoading}
      </span>
    );
  }

  if (snaps.length === 0) {
    return (
      <div className="flex justify-center mt-[30vh]">
        <div className="flex flex-col items-center">
          <BiFilm className="w-20 h-20" />
          <h1>No Snaps Available</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="flex justify-between">
        <div className="w-full text-2xl md:text-3xl font-bold px-4 py-2 pb-3">
          All Snaps
        </div>

        <div className="flex pl-2 pr-4 gap-3 md:gap-4">
          <button
            className={`whitespace-nowrap font-semibold ${
              sortBy === "views"
                ? "text-white "
                : "text-[#6a6a6a] hover:text-[#9a9a9a]"
            }`}
            onClick={() => {
              setSortBy("views");
              setSortType("-1");
              setPage(1);
            }}
          >
            Most Views
          </button>

          <button
            className={`font-semibold ${
              sortBy === "createdAt" && sortType === "-1"
                ? "text-white "
                : "text-[#6a6a6a] hover:text-[#9a9a9a]"
            }`}
            onClick={() => {
              setSortBy("createdAt");
              setSortType("-1");
              setPage(1);
            }}
          >
            Latest
          </button>

          <button
            className={`font-semibold ${
              sortBy === "createdAt" && sortType === "1"
                ? "text-white "
                : "text-[#6a6a6a] hover:text-[#9a9a9a]"
            }`}
            onClick={() => {
              setSortBy("createdAt");
              setSortType("1");
              setPage(1);
            }}
          >
            Oldest
          </button>
        </div>
      </div>

      <InfiniteScroll
        dataLength={snaps.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center mt-2 h-7">{icons.loading}</div>
        }
        scrollableTarget="scrollableDiv"
      >
        <div
          className={`h-full px-2 grid grid-cols-[repeat(auto-fit,_minmax(100px,1fr))] 
        md:grid-cols-[repeat(auto-fit,_minmax(150px,1fr))] 
        lg:grid-cols-[repeat(auto-fit,_minmax(200px,1fr))] 
        gap-1
        grid-auto-rows-[minmax(200px,_auto)]`}
        >
          {snaps.map((snap) => (
            <div key={snap._id} className="h-full flex flex-col">
              <SnapCard snap={snap} />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default AllSnaps;
