import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "../components/Icons.jsx";
import GuestDashboard from "../components/GuestPages/GuestDashboard.jsx";
import ChannelStats from "../components/Dashboard/ChannelStats.jsx";
import VideoPanel from "../components/Dashboard/VideoPanel.jsx";
import SnapPanel from "../components/Dashboard/SnapPanel.jsx";
import getChannelStats from "../hooks/getChannelStats.js";
import getChannelVideos from "../hooks/getChannelVideos.js";
import getChannelSnaps from "../hooks/getChannelSnaps.js";

function Dashboard() {
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

  const { videos, snaps, stats } = useSelector((state) => state.dashboard);

  if (!status) {
    return <GuestDashboard />;
  }

  if (videoLoading || snapLoading || statsLoading) {
    return (
      <span className="flex justify-center mt-20">{icons.bigLoading}</span>
    );
  } else {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-6 px-4 py-8">
        <ChannelStats stats={stats} />
        <h1 className="text-center text-2xl">Videos</h1>
        <VideoPanel channelVideos={videos} />
        <h1 className="pt-10 text-center text-2xl">Snaps</h1>
        <SnapPanel channelSnaps={snaps} />
      </div>
    );
  }
}

export default Dashboard;
