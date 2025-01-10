import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import GuestComponent from "./GuestComponent.jsx";

function GuestMetrics() {
  return (
    <GuestComponent
      title="See your channel statistics here."
      subtitle="Sign in to access moderation tools."
      icon={
        <span className="w-full h-full flex items-center p-4 pb-5">
          <FaRegUserCircle className="w-32 h-32" />
        </span>
      }
      route="/admin/metrics"
    />
  );
}

export default GuestMetrics;
