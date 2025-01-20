import React from "react";
import { useSelector } from "react-redux";
import { GoDeviceCameraVideo } from "react-icons/go";
import { IoEyeOutline } from "react-icons/io5";
import { BiFilm, BiMessageSquareDots } from "react-icons/bi";
import { MdOutlineSubscriptions } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";

function MetricsComponent({ stats }) {
  const user = useSelector((state) => state.auth.userData);

  return (
    <div className="grid grid-cols-[1fr,1fr,1fr,1fr,1.5fr] md:grid-rows-[1.5fr,1fr,1fr,1fr,1.5fr] gap-1 md:gap-3 lg:gap-4 w-full h-[calc(100vh-112px)] lg:h-[calc(100vh-56px)] p-1 md:p-2 lg:p-4 cursor-default">
      {/* user div */}

      <div className="root-hover bg-slate-50 text-[#2d2d2d] col-span-3 row-span-1 rounded-xl md:rounded-2xl lg:rounded-3xl flex">
        {/* avatar */}
        <div className="w-[40%] lg:w-[20%] h-[100%] bg-slate-50 rounded-tl-xl md:rounded-tl-2xl lg:rounded-tl-3xl rounded-bl-xl md:rounded-bl-2xl lg:rounded-bl-3xl overflow-hidden hover:backdrop-blur-sm avatar-img">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-full h-full object-cover rounded-tl-xl md:rounded-tl-2xl lg:rounded-tl-3xl rounded-bl-xl md:rounded-bl-2xl lg:rounded-bl-3xl "
          />
        </div>

        {/* username */}
        <div className="username h-full w-[90%] flex justify-start items-center">
          <div className="overflow-hidden text-ellipsis line-clamp-1 hover:line-clamp-none font-bold leading-tight md:text-[5vw] lg:text-[3vw]">
            {user.fullname}
          </div>
        </div>
      </div>

      {/* videos div */}

      <div className="bg-gradient-to-br from-blue-500 to-blue-300 col-span-3 row-span-2 md:row-span-3 rounded-xl md:rounded-2xl lg:rounded-3xl group relative overflow-hidden">
        <div className="w-full h-[70%] md:h-2/3 text-[15vh] md:text-[20vh] pl-5 md:pl-7 leading-tight font-semibold">
          {stats.videos}
        </div>
        <div className="w-full text-[6vh] md:text-[8vh] font-bold text-end pr-4">
          videos
        </div>
        <GoDeviceCameraVideo className="hidden lg:block w-[15vw] h-[15vw] absolute -top-2 right-4 text-[4vh] opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all duration-300 text-white" />
      </div>

      {/* snaps div */}

      <div className="bg-gradient-to-br from-red-500 to-red-300 col-start-4 col-span-2 row-start-1 row-span-3 md:col-start-4 md:col-span-2 md:row-start-1 md:row-span-4 rounded-xl md:rounded-2xl lg:rounded-3xl group relative overflow-hidden">
        <div className="w-full h-[78%] md:h-[78%] text-[15vh] md:text-[20vh] pl-7 leading-tight font-semibold">
          {stats.snaps}
        </div>
        <div className="w-full text-[6vh] md:text-[8vh] font-bold text-end pr-4">
          snaps
        </div>
        <BiFilm className="hidden lg:block absolute -bottom-10 -left-20 text-[4vh] opacity-0 group-hover:opacity-100 group-hover:translate-x-2 -rotate-12 transition-all duration-300 text-white w-[20vw] h-[20vw]" />
      </div>

      {/* tweets div */}

      <div className="bg-gradient-to-br from-teal-500 to-green-300 col-start-3 col-span-3 row-start-4 md:col-span-2 md:row-start-5 rounded-xl md:rounded-2xl lg:rounded-3xl flex group relative overflow-hidden">
        <div className="w-full flex items-start justify-start text-[10vw] md:text-[7vw] pl-3 md:pl-7 leading-tight font-semibold">
          {stats.tweets}
        </div>
        <div className="w-full text-[8vw] md:text-[6vw] lg:text-[4vw] font-bold flex justify-end items-end pr-4 pb-1 md:pb-4 ">
          tweets
        </div>
        <BiMessageSquareDots className="hidden lg:block w-[4vw] h-[4vw] absolute top-0 -right-8 text-[4vh] opacity-0 group-hover:opacity-100 group-hover:-translate-x-8 transition-all duration-300 text-white" />
      </div>

      {/* subscribers div */}

      <div className=" bg-gradient-to-br from-yellow-400 to-yellow-200 row-start-5 col-start-1 col-span-3 md:col-start-3 md:col-span-1 md:row-start-5 rounded-xl md:rounded-2xl lg:rounded-3xl font-semibold group relative overflow-hidden">
        <div className="w-full h-[55%] md:h-[60%] text-[12vw] md:text-[5vw] pl-4 leading-tight">
          {stats.subscribers}
        </div>
        <div className="w-full text-[8vw] md:text-[4vh] lg:text-[2vw] font-bold pt-auto flex justify-end items-start  overflow-hidden text-ellipsis line-clamp-1 pr-2">
          {window.innerWidth < 1024 ? "subs" : "subscribers"}
        </div>
        <MdOutlineSubscriptions className="hidden lg:block w-[8vw] h-[8vw] absolute -top-10 -right-6 text-[4vh] opacity-0 group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-300 text-white" />
      </div>

      {/* likes div */}

      <div className=" bg-gradient-to-br from-purple-500 to-purple-300 col-start-4 col-span-2 row-start-5 md:col-start-4 md:col-span-1 md:row-start-5 rounded-xl md:rounded-2xl lg:rounded-3xl group relative overflow-hidden">
        <div className="w-full h-[59%] md:h-[60%] text-[10vw] md:text-[5vw] pl-4 leading-tight font-semibold">
          {stats.likes}
        </div>
        <div className="w-full text-[7vw] md:text-[4vh] lg:text-[2vw] font-bold pt-auto flex justify-end items-center pr-4">
          likes
        </div>
        <AiOutlineLike className="hidden lg:block w-[6vw] h-[6vw] absolute -top-5 -right-3 text-[4vh] opacity-0 group-hover:opacity-100 group-hover:-rotate-12 transition-all duration-300 text-white" />
      </div>

      {/* views div */}

      <div className=" bg-gradient-to-br from-pink-500 to-pink-300 col-start-1 col-span-2 row-start-4 md:col-start-5 md:col-span-2 md:row-start-5 rounded-xl md:rounded-2xl lg:rounded-3xl group relative overflow-hidden flex-col">
        <div className="w-full h-[55%] md:h-[60%] text-[10vw] md:text-[5vw] pl-4  leading-tight font-semibold">
          {stats.views}
        </div>
        <div className="w-full text-[8vw] md:text-[4vh] lg:text-[2vw] font-bold pt-auto flex justify-end items-center pr-4">
          views
        </div>
        <IoEyeOutline className="hidden lg:block w-[5vw] h-[5vw] absolute -bottom-6 -left-3 text-[4vh] opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300 text-white" />
      </div>
    </div>
  );
}

export default MetricsComponent;
