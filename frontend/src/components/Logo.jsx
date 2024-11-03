import React from "react";

function Logo({ className = "" }) {
  const viewify_logo = "/viewify_logo.png";

  return (
    <div
      className={`font-bold text-xl flex items-center justify-center w-full ${className} text-[#FFFFFF]`}
    >
      <img
        src={`${viewify_logo}`}
        alt="logo"
        className="w-10 h-10 inline-block mr-2"
      />
      <div>Viewify</div>
    </div>
  );
}

export default Logo;
