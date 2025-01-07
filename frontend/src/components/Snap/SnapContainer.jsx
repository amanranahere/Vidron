import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../utils/axios.helper.js";
import Snaps from "../../pages/Snaps.jsx";

function SnapContainer({}) {
  const [snaps, setSnaps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef();

  useEffect(() => {
    const fetchSnaps = async () => {
      try {
        const response = await axiosInstance.get(
          `/snaps?sortBy=views&limit=10`
        );
        if (response?.data?.data?.snaps) {
          setSnaps(response.data.data.snaps);
        }
      } catch (error) {
        console.error("Error fetching snaps:", error);
      }
    };

    fetchSnaps();
  }, []);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight } = e.target;
    const snapHeight = clientHeight;
    const newIndex = Math.round(scrollTop / snapHeight);

    if (newIndex !== currentIndex && newIndex < snaps.length) {
      setCurrentIndex(newIndex);
    }
  };

  const handleUpButtonClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      scrollToSnap(currentIndex - 1);
    }
  };

  const handleDownButtonClick = () => {
    if (currentIndex < snaps.length - 1) {
      setCurrentIndex(currentIndex + 1);
      scrollToSnap(currentIndex + 1);
    }
  };

  const scrollToSnap = (index) => {
    const snapElement = containerRef.current.children[index];
    if (snapElement) {
      snapElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-screen md:h-[calc(100vh-56px)] overflow-y-scroll snap-y snap-mandatory"
    >
      {snaps.map((snap, index) => (
        <div
          key={snap._id}
          className="h-screen md:h-[calc(100vh-56px)] snap-start"
        >
          {index === currentIndex && (
            <Snaps
              snapId={snap._id}
              handleUpButtonClick={handleUpButtonClick}
              handleDownButtonClick={handleDownButtonClick}
              disableUp={currentIndex === 0}
              disableDown={currentIndex === snaps.length - 1}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default SnapContainer;
