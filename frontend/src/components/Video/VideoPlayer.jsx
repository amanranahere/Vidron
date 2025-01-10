import React from "react";

const VideoPlayer = ({ videoFile }) => {
  return (
    <div className="bg-black z-50 lg:rounded-xl">
      <video
        className="w-screen lg:max-w-[60vw] max-w-none h-auto max-h-[35vh] md:max-h-[40vh] lg:max-h-[75vh] lg:rounded-xl"
        controls
        autoPlay
      >
        <source src={videoFile} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoPlayer;
