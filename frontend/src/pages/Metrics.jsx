import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "../components/Icons.jsx";
import GuestMetrics from "../components/GuestPages/GuestMetrics.jsx";
import MetricsComponent from "../components/Metrics/MetricsComponent.jsx";
import getChannelStats from "../hooks/getChannelStats.js";
import getChannelVideos from "../hooks/getChannelVideos.js";
import getChannelSnaps from "../hooks/getChannelSnaps.js";

function Metrics() {
  const dispatch = useDispatch();
  const { status, userData } = useSelector((state) => state.auth);
  const [statsLoading, setStatsLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [snapLoading, setSnapLoading] = useState(true);

  useEffect(() => {
    if (status && userData && userData._id) {
      getChannelVideos(dispatch).then(() => setVideoLoading(false));

      getChannelSnaps(dispatch).then(() => setSnapLoading(false));

      getChannelStats(dispatch, userData._id).then(() =>
        setStatsLoading(false)
      );
    }
  }, [status, userData, dispatch]);

  const { videos, snaps, stats } = useSelector((state) => state.metrics);

  if (!status) {
    return <GuestMetrics />;
  }

  if (videoLoading || snapLoading || statsLoading) {
    return (
      <span className="flex justify-center mt-20">{icons.bigLoading}</span>
    );
  } else {
    return (
      <div className="">
        <MetricsComponent stats={stats} />
      </div>
    );
  }
}

export default Metrics;
