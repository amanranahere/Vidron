import React, { useState } from "react";
import Button from "../Button.jsx";
import { useSelector } from "react-redux";
import Search from "./Search.jsx";
import { Link, useLocation } from "react-router-dom";
import Logo from "../Logo.jsx";
import { HiOutlineMenu, HiOutlineMenuAlt1 } from "react-icons/hi";
import Sidebar from "../Sidebar.jsx";

function Navbar() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const location = useLocation();
  const isWatchPage = location.pathname.includes("/video-watchpage");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex items-center bg-black p-1">
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
            <div className="flex py-4">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="px-4 mr-4 hover:bg-[#2a2a2a] rounded-full"
              >
                <HiOutlineMenuAlt1 className="w-6 h-6" />
              </button>

              <Link to="/" onClick={() => setMenuOpen(false)}>
                <Logo />
              </Link>
            </div>

            <Sidebar onClose={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <Link to="/">
        <Logo />
      </Link>

      <Search />
      {!authStatus && (
        <div>
          <Link to="/login">
            <Button className="cursor-pointer hover:bg-gray-500 mr-1 py-2 rounded transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] sm:w-auto">
              Log in
            </Button>
          </Link>

          <Link to="/signup">
            <Button className="cursor-pointer hover:bg-pink-600 mr-1 rounded bg-pink-700 px-3 py-2 text-center transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] sm:w-auto">
              Sign up
            </Button>
          </Link>
        </div>
      )}

      {authStatus && userData && (
        <Link to={`/channel/${userData.username}`}>
          <img
            src={userData.avatar}
            alt={userData.username}
            className="object-cover h-10 w-10 shrink-0 rounded-full"
          />
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
