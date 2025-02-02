import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import {
  Channel,
  Metrics,
  Help,
  History,
  Home,
  LikedVideos,
  LikedSnaps,
  LikedTweets,
  Login,
  Search,
  Settings,
  Signup,
  Subscriptions,
  Tweets,
  Video,
  SendFeedback,
  SingleSnap,
  AllSnaps,
} from "./pages/index.js";
import SnapsFeed from "./components/Snap/SnapsFeed.jsx";
import ChannelVideos from "./components/Channel/ChannelVideos.jsx";
import ChannelSnaps from "./components/Channel/ChannelSnaps.jsx";
import ChannelTweets from "./components/Channel/ChannelTweets.jsx";
import AboutChannel from "./components/Channel/AboutChannel.jsx";
import ChannelSubscribed from "./components/Channel/ChannelSubscribed.jsx";
import ChannelPlaylist from "./components/Channel/ChannelPlaylist.jsx";
import PlaylistVideos from "./components/Playlist/PlaylistVideos.jsx";
import PageNotFound from "./components/PageNotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/snaps",
        element: <SnapsFeed />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/search/:query",
        element: <Search />,
      },
      {
        path: "/video-watchpage/:videoId",
        element: <Video />,
      },
      {
        path: "/snap-watchpage/:snapId",
        element: <SingleSnap />,
      },
      {
        path: "/liked-videos",
        element: <LikedVideos />,
      },
      {
        path: "/liked-snaps",
        element: <LikedSnaps />,
      },
      {
        path: "/liked-tweets",
        element: <LikedTweets />,
      },
      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/help",
        element: <Help />,
      },
      {
        path: "/send-feedback",
        element: <SendFeedback />,
      },
      {
        path: "/tweets",
        element: <Tweets />,
      },
      {
        path: "/channel/:username",
        element: <Channel />,
        children: [
          {
            path: "/channel/:username",
            element: <ChannelVideos />,
          },
          {
            path: "/channel/:username/snaps",
            element: <ChannelSnaps />,
          },
          {
            path: "/channel/:username/tweets",
            element: <ChannelTweets />,
          },
          {
            path: "/channel/:username/playlist",
            element: <ChannelPlaylist />,
          },
          {
            path: "/channel/:username/subscribed",
            element: <ChannelSubscribed />,
          },
          {
            path: "/channel/:username/about",
            element: <AboutChannel />,
          },
        ],
      },
      {
        path: "/playlist/:playlistId",
        element: <PlaylistVideos />,
      },
      {
        path: "/subscriptions",
        element: <Subscriptions />,
      },
      {
        path: "/admin/metrics/:username?",
        element: <Metrics />,
      },
      {
        path: "/all-snaps",
        element: <AllSnaps />,
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
  ,
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
