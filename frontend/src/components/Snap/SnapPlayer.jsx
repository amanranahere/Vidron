import React from "react";

const SnapPlayer = ({ snapFile }) => {
  return (
    <video
      className="rounded-[20px]  aspect-[9/16] object-cover bg-red-500"
      style={{
        maxHeight: "calc(100% - 20px)",
      }}
      controls
      autoPlay
    >
      <source src={snapFile} type="video/mp4" />
    </video>
  );
};

export default SnapPlayer;
