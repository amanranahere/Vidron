import React from "react";

function Logo() {
  const vidron_logo = "/vidron_logo.png";

  return (
    <div>
      <img src={`${vidron_logo}`} alt="logo" className="h-10 inline-block" />
    </div>
  );
}

export default Logo;
