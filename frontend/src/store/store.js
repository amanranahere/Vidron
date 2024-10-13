import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";

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
