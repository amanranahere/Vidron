import React from "react";

function Button({
  children,
  type = "Button",
  bgColor = "bg-black",
  textColor = "Text-white",
  className = "",
  ...props
}) {
  return (
    <button
      className={`px-4 py-1 ${className} ${textColor} ${bgColor}`}
      {...props}
      type={type}
    >
      {children}
    </button>
  );
}

export default Button;
