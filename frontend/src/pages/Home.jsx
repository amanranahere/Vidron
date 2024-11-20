import React from "react";
import VideoContainer from "../components/Video/VideoContainer.jsx";
import SnapContainer from "../components/Snap/SnapContainer.jsx";

function Home() {
  return (
    <div>
      <div>
        <VideoContainer />
      </div>

      <div className="bg-gray-900">
        <h1 className="bg-gray text-center text-3xl py-5">Snaps</h1>
        <SnapContainer />
      </div>
    </div>
  );
}

export default Home;
