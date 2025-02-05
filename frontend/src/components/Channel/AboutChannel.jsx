import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { icons } from "../Icons.jsx";
import formatDate from "../../utils/formatDate.js";
import axiosInstance from "../../utils/axios.helper.js";
import { MdOutlineEmail } from "react-icons/md";
import { IoGlobeOutline, IoEyeOutline } from "react-icons/io5";
import { BsPlayBtn } from "react-icons/bs";
import { GoInfo } from "react-icons/go";
import { BiFilm, BiMessageSquareDots } from "react-icons/bi";
import { AiOutlineLike } from "react-icons/ai";

function AboutChannel() {
  const { username } = useParams();
  const user = useSelector((state) => state.user.user);
  const [aboutChannel, setAboutChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAboutChannel = async () => {
    try {
      const response = await axiosInstance.get(`/metrics/stats/${username}`);
      if (response?.data?.success) {
        setAboutChannel(response.data.data);
      }
    } catch (error) {
      console.log("Error fetching channel details", error);
    }
  };

  useEffect(() => {
    getAboutChannel().then(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (username) {
      getAboutChannel();
    }
  }, [username]);

  if (loading) {
    return (
      <span className="flex justify-center mt-20">{icons.bigLoading}</span>
    );
  }

  return (
    <div className="text-white px-6 pt-4">
      <div className="mb-4">
        <p className="ml-1">{user.description}</p>
      </div>

      <div className="mb-6">
        <p className="ml-1 mb-[6px] flex items-center gap-2">
          <MdOutlineEmail className="w-6 h-6" />
          <a
            href={`mailto:${user.email}`}
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            {user.email}
          </a>
        </p>

        <p className="ml-1 mb-[6px] flex items-center gap-2">
          <IoGlobeOutline className="w-6 h-6" />
          <a
            href={`/channel/${username}`}
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            {`${
              import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
            }/channel/${username}`}
          </a>
        </p>

        <p className="ml-1 mb-[6px] flex items-center gap-2">
          <BsPlayBtn className="w-6 h-6" />
          <span>
            <span className="font-semibold">
              {aboutChannel.videos > 0 ? aboutChannel.videos : 0}
            </span>{" "}
            Videos
          </span>
        </p>

        <p className="ml-1 mb-[6px] flex items-center gap-2">
          <BiFilm className="w-6 h-6" />
          <span>
            <span className="font-semibold">
              {aboutChannel.snaps > 0 ? aboutChannel.snaps : 0}
            </span>{" "}
            Snaps
          </span>
        </p>

        <p className="ml-1 mb-[6px] flex items-center gap-2">
          <IoEyeOutline className="w-6 h-6" />
          <span>
            <span className="font-semibold">
              {aboutChannel.views > 0 ? aboutChannel.views : 0}
            </span>{" "}
            Views
          </span>
        </p>

        <p className="ml-1 mb-[6px] flex items-center gap-2">
          <AiOutlineLike className="w-6 h-6" />
          <span>
            <span className="font-semibold">
              {aboutChannel.likes > 0 ? aboutChannel.likes : 0}
            </span>{" "}
            Likes
          </span>
        </p>

        <p className="ml-1 mb-[6px] flex items-center gap-2">
          <BiMessageSquareDots className="w-6 h-6" />
          <span>
            <span className="font-semibold">
              {aboutChannel.tweets > 0 ? aboutChannel.tweets : 0}
            </span>{" "}
            Tweets
          </span>
        </p>

        <p className="ml-1 mb-[6px] flex items-center gap-2">
          <GoInfo className="w-6 h-6" />
          <span>
            Joined on{" "}
            <span className="font-semibold">
              {formatDate(aboutChannel.createdAt)}
            </span>
          </span>
        </p>
      </div>
    </div>
  );
}

export default AboutChannel;
