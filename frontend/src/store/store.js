import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import userSlice from "./userSlice.js";
import videoSlice from "./videoSlice.js";
import tweetsSlice from "./tweetsSlice.js";
import snapSlice from "./snapSlice.js";
import playlistSlice from "./playlistSlice.js";
import playlistsSlice from "./playlistsSlice.js";
import dashboardSlice from "./dashboardSlice.js";

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    video: videoSlice,
    tweets: tweetsSlice,
    snap: snapSlice,
    playlist: playlistSlice,
    playlists: playlistsSlice,
    dashboard: dashboardSlice,
  },
});

export default store;
