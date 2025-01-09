import React from "react";

const VideoPlayer = ({ videoFile }) => {
  return (
    <video
      className="w-full max-w-full h-auto max-h-[35vh] md:max-h-[40vh] lg:max-h-[70vh] lg:rounded-xl bg-black"
      controls
      autoPlay
    >
      <source src={videoFile} type="video/mp4" />
    </video>
  );
};

export default VideoPlayer;
