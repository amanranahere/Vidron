import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../utils/axios.helper";
import SnapCard from "./SnapCard.jsx";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function SnapContainer() {
  const scrollRef = useRef(null);
  const [snaps, setSnaps] = useState([]);
  const [loading, setLoading] = useState(true);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -280 : 280,
        behavior: "smooth",
      });
    }
  };

  const getData = async () => {
    try {
      const response = await axiosInstance.get(
        `/snaps?limit=6&sortBy=createdAt&sortType=-1`
      );
      setSnaps(response.data.data.snaps);
    } catch (error) {
      console.error("Error fetching snaps", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="overflow-x-scroll scrollbar-none flex flex-wrap justify-evenly md:flex-nowrap px-1 lg:px-2 gap-2 w-full snap-container-mask"
      >
        {snaps.map((snap, index) => (
          <div
            key={snap._id}
            className="w-[48%] md:w-[23%] lg:w-[21.5%] shrink-0 md:last:mr-16 lg:last:mr-28"
          >
            <SnapCard snap={snap} />
          </div>
        ))}
      </div>

      {/* left scroll button */}
      <button
        onClick={() => scroll("left")}
        className="hidden lg:block absolute right-6 bottom-6 z-30 bg-[#2a2a2a] hover:bg-[#3a3a3a] active:scale-90 text-white/80 p-4 rounded-full shadow-md"
      >
        <FaArrowLeft className="h-6 w-6" />
      </button>

      {/* right scroll button */}
      <button
        onClick={() => scroll("right")}
        className="hidden lg:block absolute right-6 bottom-24 z-50 bg-[#2a2a2a] hover:bg-[#3a3a3a] active:scale-90 text-white/80 p-4 rounded-full shadow-md"
      >
        <FaArrowRight className="h-6 w-6" />
      </button>
    </div>
  );
}

export default SnapContainer;
