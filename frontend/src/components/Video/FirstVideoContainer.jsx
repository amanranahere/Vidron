import React, { useEffect, useState } from "react";
import { FaVideo } from "react-icons/fa";
import { icons } from "../Icons.jsx";
import axiosInstance from "../../utils/axios.helper.js";
import VideoCard from "./VideoCard.jsx";

function VideoContainer() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await axiosInstance.get(`/videos?skip=0&limit=6`);
      setVideos(response.data.videos);
    } catch (error) {
      console.log("Error fetching videos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <span className="flex justify-center mt-32 h-screen w-full">
        {icons.bigLoading}
      </span>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <FaVideo className="w-20 h-20" />
          <h1>No Videos Available</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <div
        className={`grid grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))] md:grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] lg:grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))] gap-1 ${
          videos.length < 3 &&
          "sm:grid-cols-[repeat(auto-fit,_minmax(400px,0.34fr))] 2xl:grid-cols-[repeat(auto-fit,_minmax(300px,0.24fr))]"
        }`}
      >
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default VideoContainer;
