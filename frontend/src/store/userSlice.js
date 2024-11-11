import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  userVideo: [],
  userPlaylist: null,
  userTweets: [],
  userSnaps: [],
  userLikedVideos: [],
  userLikedTweets: [],
  userLikedSnaps: [],
  userHistory: [],
  userSubscribed: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },

    addUserVideo: (state, action) => {
      const newVideos = action.payload.filter(
        (newVideo) =>
          !state.userVideo.some((video) => video._id === newVideo._id)
      );
      state.userVideo = [...state.userVideo, ...newVideos];
    },

    removeUserVideo: (state) => {
      state.userVideo = [];
    },

    removeUserVideoById: (state, action) => {
      state.userVideo = state.userVideo.filter(
        (video) => video._id !== action.payload
      );
    },

    addUserPlaylist: (state, action) => {
      state.userPlaylist = action.payload;
    },

    addUserTweets: (state, action) => {
      state.userTweets = [
        ...state.userTweets,
        ...(Array.isArray(action.payload) ? action.payload : []),
      ];
    },

    removeUserTweets: (state) => {
      state.userTweets = [];
    },

    removeUserTweetById: (state, action) => {
      state.userTweets = state.userTweets.filter(
        (tweet) => tweet._id !== action.payload
      );
    },

    addUserSnaps: (state, action) => {
      const newSnaps = action.payload.filter(
        (newSnap) => !state.userSnaps.some((snap) => snap._id === newSnap._id)
      );
      state.userSnaps = [...state.userSnaps, ...newSnaps];
    },

    removeUserSnaps: (state) => {
      state.userSnaps = [];
    },

    removeUserSnapById: (state, action) => {
      state.userSnaps = state.userSnaps.filter(
        (snap) => snap._id !== action.payload
      );
    },

    addUserLikedVideos: (state, action) => {
      state.userLikedVideos = [...state.userLikedVideos, ...action.payload];
    },

    removeUserLikedVideos: (state) => {
      state.userLikedVideos = [];
    },

    addUserLikedSnaps: (state, action) => {
      state.userLikedSnaps = [...state.userLikedSnaps, ...action.payload];
    },

    removeUserLikedSnaps: (state) => {
      state.userLikedSnaps = [];
    },

    addUserLikedTweets: (state, action) => {
      state.userLikedTweets = [...state.userLikedTweets, ...action.payload];
    },

    removeUserLikedTweets: (state) => {
      state.userLikedTweets = [];
    },

    addUserHistory: (state, action) => {
      state.userHistory = [...state.userHistory, ...action.payload];
    },

    removeUserHistory: (state) => {
      state.userHistory = [];
    },

    addUserSubscribed: (state, action) => {
      state.userSubscribed = action.payload;
    },

    toggleUserSubscribe: (state, action) => {
      state.userSubscribed.channels = state.userSubscribed.channels.map(
        (profile) =>
          profile._id === action.payload.profileId
            ? {
                ...profile,
                isSubsribed: action.payload.isSubscribed,
                subscribersCount: action.payload.subscribersCount,
              }
            : profile
      );
    },
  },
});

export const {
  addUser,
  addUserVideo,
  removeUserVideo,
  removeUserVideoById,
  addUserPlaylist,
  addUserTweets,
  removeUserTweets,
  removeUserTweetById,
  addUserSnaps,
  removeUserSnaps,
  removeUserSnapById,
  addUserLikedVideos,
  removeUserLikedVideos,
  addUserLikedTweets,
  removeUserLikedTweets,
  addUserLikedSnaps,
  removeUserLikedSnaps,
  addUserHistory,
  removeUserHistory,
  addUserSubscribed,
  toggleUserSubscribe,
} = userSlice.actions;

export default userSlice.reducer;
