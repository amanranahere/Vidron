import React from "react";
import { useNavigate } from "react-router-dom";

import FirstVideoContainer from "../components/Video/FirstVideoContainer.jsx";
import SecondVideoContainer from "../components/Video/SecondVideoContainer.jsx";
import SnapContainer from "../components/Snap/SnapContainer.jsx";
import { BiFilm } from "react-icons/bi";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="pb-16">
      {/* first videos container */}

      <FirstVideoContainer />

      {/* snaps container */}
      <div className="mb-4 md:px-4 lg:px-0">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2 pb-3 pt-5 px-2 ">
            <BiFilm className="w-7 h-9 text-cyan-300" />
            <h1 className="bg-gray text-start font-bold text-2xl ">Snaps</h1>
          </div>

          <button
            onClick={() => navigate("/all-snaps")}
            className="py-2 lg:px-4 mx-3 mb-2 font-semibold rounded-lg hover:bg-[#3a3a3a] active:scale-95"
          >
            View all
          </button>
        </div>

        <SnapContainer />
      </div>

      {/* second videos container */}

      <SecondVideoContainer />
    </div>
  );
}

export default Home;
