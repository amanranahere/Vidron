import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { GoDeviceCameraVideo } from "react-icons/go";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegUser, FaRegHeart, FaPlayCircle } from "react-icons/fa";
import InfoBox from "../InfoBox";

function MetricsComponent({ stats }) {
  const user = useSelector((state) => state.auth.userData);

  return (
    <div className="grid grid-cols-5 grid-rows-[1.5fr,1fr,1fr,1fr,1.5fr] gap-4 h-[calc(100vh-56px)] p-4 bg-white">
      {/* user div */}

      <div className="root-hover bg-black col-span-3 row-span-1 rounded-3xl flex cursor-default">
        {/* avatar */}
        <div className="w-[20%] h-[100%] bg-black rounded-tl-3xl rounded-bl-3xl overflow-hidden hover:backdrop-blur-sm avatar-img">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-full h-full object-cover rounded-tl-3xl rounded-bl-3xl "
          />
        </div>

        {/* username */}
        <div className="username h-full w-[90%] flex justify-start items-center text-[7vh] ">
          <div className="overflow-hidden text-ellipsis line-clamp-1 hover:line-clamp-none font-semibold leading-tight">
            {user.fullname}
          </div>
        </div>
      </div>

      {/* videos div */}

      <div className=" bg-black col-span-3 row-span-3 rounded-3xl">
        <div className="w-full h-2/3 text-[20vh] pl-7 leading-tight">
          {stats.videos}
        </div>
        <div className="w-full text-[8vh] font-bold text-end pr-4">videos</div>
      </div>

      {/* snaps div */}

      <div className=" bg-red-500 col-start-4 col-span-2 row-start-1 row-span-4 rounded-3xl">
        <div className="w-full h-3/4 text-[20vh] pl-7 leading-tight">
          {stats.snaps}
        </div>
        <div className="w-full text-[8vh] font-bold text-end pr-4">snaps</div>
      </div>

      {/* tweets div */}

      <div className=" bg-teal-300 col-span-2 row-start-5 rounded-3xl flex">
        <div className="w-full flex items-end text-[22vh] pl-7 leading-tight">
          {stats.tweets}
        </div>
        <div className="w-full text-[8vh] font-bold text-end pr-4">tweets</div>
      </div>

      {/* subscribers div */}

      <div className=" bg-yellow-200 col-start-3 row-start-5 rounded-3xl  ">
        <div className="w-full h-3/4 text-[15vh] pl-7 leading-tight">
          {stats.subscribers}
        </div>
        <div className="w-full text-[4vh] font-bold pt-auto flex justify-end items-center pr-4 overflow-hidden text-ellipsis line-clamp-1">
          subscribers
        </div>
      </div>

      {/* likes div */}

      <div className=" bg-purple-500 col-start-4 row-start-5  rounded-3xl">
        <div className="w-full h-3/4 text-[15vh] pl-7 leading-tight">
          {stats.likes}
        </div>
        <div className="w-full text-[4vh] font-bold pt-auto flex justify-end items-center pr-4">
          likes
        </div>
      </div>

      {/* views div */}

      <div
        className=" bg-pink-500 col-start-5 row-start-5 
       rounded-3xl"
      >
        <div className="w-full h-3/4 text-[15vh] pl-7 leading-tight">
          {stats.views}
        </div>
        <div className="w-full text-[4vh] font-bold pt-auto flex justify-end items-center pr-4">
          views
        </div>
      </div>
    </div>

    // old component
    // <>
    //   <div className="grid grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))] gap-4">
    //     <InfoBox
    //       key="total-videos"
    //       title="Total Videos"
    //       value={stats.videos}
    //       icon={<GoDeviceCameraVideo className="h-6 w-6" />}
    //     />

    //     <InfoBox
    //       key="total-snaps"
    //       title="Total Snaps"
    //       value={stats.snaps}
    //       icon={<FaPlayCircle className="h-6 w-6" />}
    //     />

    //     <InfoBox
    //       key="total-tweets"
    //       title="Total Tweets"
    //       value={stats.tweets}
    //       icon={<FaPlayCircle className="h-6 w-6" />}
    //     />

    //     <InfoBox
    //       key="total-views"
    //       title="Total Views"
    //       value={stats.views > 0 ? stats.views : 0}
    //       icon={<MdOutlineRemoveRedEye className="h-6 w-6" />}
    //     />

    //     <InfoBox
    //       key="total-subscribers"
    //       title="Total Subscribers"
    //       value={stats.subscribers > 0 ? stats.subscribers : 0}
    //       icon={<FaRegUser className="h-6 w-6" />}
    //     />

    //     <InfoBox
    //       key="total-likes"
    //       title="Total Likes"
    //       value={stats.likes > 0 ? stats.likes : 0}
    //       icon={<FaRegHeart className="h-6 w-6" />}
    //     />
    //   </div>
    // </>
  );
}

export default MetricsComponent;
