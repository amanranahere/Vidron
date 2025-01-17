import React from "react";
import { AiOutlineLike } from "react-icons/ai";
import GuestComponent from "./GuestComponent.jsx";

function GuestLikedContent({ content }) {
  return (
    <GuestComponent
      title={`Save your favourite ${content}`}
      subtitle={`Revisit the ${content} you love by signing in and liking them.`}
      icon={
        <span className="w-full h-full flex items-center p-4 pb-5">
          <AiOutlineLike className="w-32 h-32" />
        </span>
      }
      route={`/liked-${content}`}
    />
  );
}

export default GuestLikedContent;
