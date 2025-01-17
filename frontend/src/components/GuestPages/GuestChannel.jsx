import React from "react";
import GuestComponent from "./GuestComponent.jsx";
import { FaTv } from "react-icons/fa6";

function GuestChannel() {
  return (
    <GuestComponent
      title="Create your own channel"
      subtitle="Log in to get started!"
      icon={
        <span className="w-full h-full flex items-center p-4 pb-2">
          <FaTv className="w-32 h-32" />
        </span>
      }
      route="/"
    />
  );
}

export default GuestChannel;
