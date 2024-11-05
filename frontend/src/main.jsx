import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, router, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import {
  Channel,
  Dashboard,
  Help,
  History,
  Home,
  LikedVideos,
  Login,
  Search,
  Settings,
  Signup,
  Snaps,
  Subscriptions,
  Tweets,
  Video,
} from "./pages/index.js";
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
        path: "/watchpage/:videoId",
        element: <Video />,
      },
      {
        path: "/watchpage/:snapId",
        element: <Snaps />,
      },
      {
        path: "/liked-videos",
        element: <LikedVideos />,
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
          // {
          //   path: "/channel/:username",
          //   element: <ChannelSnaps />,
          // },
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
        path: "/admin/dashboard",
        element: <Dashboard />,
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
