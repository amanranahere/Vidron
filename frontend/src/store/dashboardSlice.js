import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videos: null,
  snaps: null,
  stats: {
    totalVideos: 0,
    totalSnaps: 0,
  },
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // reducers for videos

    setVideos: (state, action) => {
      state.videos = action.payload;
    },

    updateVideoPublishedStatus: (state, action) => {
      if (state.videos) {
        state.videos = state.videos.map((video) =>
          video._id === action.payload.videoId
            ? {
                ...video,
                isPublished: action.payload.isPublished,
              }
            : video
        );
      }
    },

    deleteVideo: (state, action) => {
      if (state.videos) {
        state.videos = state.videos.filter(
          (video) => video._id !== action.payload.videoId
        );
      }
    },

    setStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },

    addVideoStats: (state) => {
      if (state.stats && typeof state.stats.totalVideos === "number") {
        state.stats.totalVideos += 1;
      }
    },

    // reducers for snaps

    setSnaps: (state, action) => {
      state.snaps = action.payload;
    },

    updateSnapPublishedStatus: (state, action) => {
      if (state.snaps) {
        state.snaps = state.snaps.map((snap) =>
          snap._id === action.payload.snapId
            ? {
                ...snap,
                isPublished: action.payload.isPublished,
              }
            : snap
        );
      }
    },

    deleteSnap: (state, action) => {
      if (state.snaps) {
        state.snaps = state.snaps.filter(
          (snap) => snap._id !== action.payload.snapId
        );
      }
    },

    setSnapStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },

    addSnapStats: (state) => {
      if (state.stats && typeof state.stats.totalSnaps === "number") {
        state.stats.totalSnaps += 1;
      }
    },
  },
});

export const {
  setVideos,
  updateVideoPublishedStatus,
  deleteVideo,
  setStats,
  addVideoStats,
  setSnaps,
  updateSnapPublishedStatus,
  deleteSnap,
  setSnapStats,
  addSnapStats,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
