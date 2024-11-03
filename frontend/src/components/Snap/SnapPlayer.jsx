import React from "react";

const SnapPlayer = ({ snapFile }) => {
  return (
    <video className="rounded-xl w-full max-h-[70vh]" controls autoPlay>
      <source src={snapFile} type="snap/mp4" />
    </video>
  );
};

export default SnapPlayer;
