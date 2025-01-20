import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios.helper.js";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setVideo } from "../store/videoSlice.js";
import VideoPlayer from "../components/Video/VideoPlayer.jsx";
import VideoListCard from "../components/Video/VideoListCard.jsx";
import VideoInfo from "../components/Video/VideoInfo.jsx";
import Comments from "../components/Video/VideoComments.jsx";
import GuestComponent from "../components/GuestPages/GuestComponent.jsx";
import { IoPlayCircleOutline } from "react-icons/io5";
import { icons } from "../components/Icons.jsx";

function Video() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { videoId } = useParams();
  const [videos, setVideos] = useState([]);
  const { video } = useSelector((state) => state.video);
  const authStatus = useSelector((state) => state.auth.status);

  const fetchVideo = async (data) => {
    setError("");
    try {
      const response = await axiosInstance.get(`/videos/${videoId}`);
      if (response?.data?.data) {
        dispatch(setVideo(response.data.data));
      }
    } catch (error) {
      setError(
        <GuestComponent
          title="Video does not exist"
          subtitle="There is no video present for given videoId. It may have been moved or deleted."
          icon={
            <span className="w-full h-full flex items-center p-4">
              <IoPlayCircleOutline className="w-28 h-28" />
            </span>
          }
          guest={false}
        />
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await axiosInstance.get(`/videos?sortBy=views&limit=20`);
      if (response?.data?.videos?.length > 0) {
        setVideos(response.data.videos);
      }
    } catch (error) {
      console.log("Error fetching videos", error);
    }
  };

  useEffect(() => {
    fetchVideo();
    fetchVideos();
  }, [videoId, authStatus]);

  if (error) {
    return error;
  }

  return (
    <div>
      {loading ? (
        <span className="flex justify-center mt-20">{icons.bigLoading}</span>
      ) : (
        <div className="flex w-full lg:pl-24 lg:pt-4 radial-bg">
          <div className="lg:w-[60vw]">
            <div className="sticky top-0 lg:static z-30">
              <VideoPlayer key={video._id} videoFile={video.videoFile} />
            </div>

            <div>
              <VideoInfo video={video} />
            </div>

            <div>
              <Comments video={video} />
            </div>

            {/* sm and md screen sizes */}
            {window.innerWidth < 1024 && (
              <div className="md:ml-2">
                {videos
                  ?.filter((video) => video?._id !== videoId)
                  .map((video) => (
                    <VideoListCard key={video?._id} video={video} />
                  ))}
              </div>
            )}
          </div>

          {/* lg screen size */}
          {window.innerWidth >= 1024 && (
            <div className="w-[30%] mx-3">
              {videos
                ?.filter((video) => video?._id !== videoId)
                .map((video) => (
                  <VideoListCard key={video?._id} video={video} />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Video;
