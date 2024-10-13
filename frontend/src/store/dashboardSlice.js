import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videos: null,
  stats: {
    totalVideos: 0,
  },
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
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
      state.stats = action.payload;
    },

    addVideoStats: (state) => {
      if (state.stats && typeof state.stats.totalVideos === "number") {
        state.stats.totalVideos += 1;
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
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
