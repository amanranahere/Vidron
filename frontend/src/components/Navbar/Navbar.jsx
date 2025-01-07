import React, { useState } from "react";
import { useSelector } from "react-redux";
import Search from "./Search.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../Logo.jsx";
import { HiOutlineMenu, HiOutlineMenuAlt1 } from "react-icons/hi";
import Sidebar from "../Sidebar.jsx";
import { FaRegUserCircle } from "react-icons/fa";

function Navbar() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const location = useLocation();
  const isWatchPage = location.pathname.includes("/video-watchpage");
  const isSnapWatchPage = location.pathname.includes("/snap");

  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav
      className={`${
        isSnapWatchPage ? "hidden md:flex" : ""
      } flex justify-between items-center`}
    >
      <div className="flex justify-center items-center">
        {isWatchPage && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-3 py-3 hidden lg:block rounded-full hover:bg-[#2a2a2a]"
          >
            <HiOutlineMenu className="w-6 h-6" />
          </button>
        )}

        {isWatchPage && menuOpen && (
          <div className="fixed inset-0 z-50">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setMenuOpen(false)}
            ></div>

            <div
              className={`absolute top-0 left-0 h-full w-72 bg-black flex-col overflow-y-scroll scrollbar-thin scrollbar-thumb-[#2a2a2a] scrollbar-track-black`}
            >
              <div className="flex py-1 px-2">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="px-3 py-3 mr-4 hover:bg-[#2a2a2a] rounded-full"
                >
                  <HiOutlineMenuAlt1 className="w-6 h-6" />
                </button>

                <Link to="/" onClick={() => setMenuOpen(false)}>
                  <Logo className="pt-2" />
                </Link>
              </div>

              <Sidebar onClose={() => setMenuOpen(false)} />
            </div>
          </div>
        )}

        <div className="ml-2 mt-2">
          <Link to="/">
            <Logo />
          </Link>
        </div>
      </div>

      <Search />

      {!authStatus && (
        <div>
          <button
            className="max-w-max cursor-pointer hover:bg-gray-600 active:bg-gray-700 mr-1 px-4 py-2 rounded-full border border-solid border-[#6a6a6a] text-gray-200 font-bold flex"
            onClick={() => {
              navigate("/login");
            }}
          >
            <FaRegUserCircle className="text-2xl opacity-90 mr-2" />
            Sign in
          </button>
        </div>
      )}

      {authStatus && userData && (
        <div className="relative group w-48 flex justify-end">
          <Link
            to={`/channel/${userData.username}`}
            className=" flex items-center space-x-2"
          >
            <span className="hidden group-hover:inline-block text-sm font-medium duration">
              {userData.username}
            </span>
            <img
              src={userData.avatar}
              alt={userData.username}
              className="object-cover h-10 w-10 rounded-full hover:opacity-70"
            />
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
