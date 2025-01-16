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
  userVideoHistory: [],
  userSnapHistory: [],
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
      if (Array.isArray(action.payload.videoDetails)) {
        const newLikedVideos = action.payload.videoDetails.filter(
          (newVideo) =>
            !state.userLikedVideos.some((video) => video._id === newVideo._id)
        );
        state.userLikedVideos = [...state.userLikedVideos, ...newLikedVideos];
      }
    },

    removeUserLikedVideos: (state) => {
      state.userLikedVideos = [];
    },

    addUserLikedSnaps: (state, action) => {
      if (Array.isArray(action.payload.snapDetails)) {
        const newLikedSnaps = action.payload.snapDetails.filter(
          (newSnap) =>
            !state.userLikedSnaps.some((snap) => snap._id === newSnap._id)
        );
        state.userLikedSnaps = [...state.userLikedSnaps, ...newLikedSnaps];
      }
    },

    removeUserLikedSnaps: (state) => {
      state.userLikedSnaps = [];
    },

    addUserLikedTweets: (state, action) => {
      if (Array.isArray(action.payload.tweetDetails)) {
        const newLikedTweets = action.payload.tweetDetails.filter(
          (newTweet) =>
            !state.userLikedTweets.some((tweet) => tweet._id === newTweet._id)
        );
        state.userLikedTweets = [...state.userLikedTweets, ...newLikedTweets];
      }
    },

    removeUserLikedTweets: (state) => {
      state.userLikedTweets = [];
    },

    addUserVideoHistory: (state, action) => {
      const newHistory = action.payload.filter(
        (item) =>
          !state.userVideoHistory.some(
            (existingItem) => existingItem._id === item._id
          )
      );
      state.userVideoHistory = [...state.userVideoHistory, ...newHistory];
    },

    removeUserVideoHistory: (state) => {
      state.userVideoHistory = [];
    },

    addUserSnapHistory: (state, action) => {
      const newHistory = action.payload.filter(
        (item) =>
          !state.userSnapHistory.some(
            (existingItem) => existingItem._id === item._id
          )
      );
      state.userSnapHistory = [...state.userSnapHistory, ...newHistory];
    },

    removeUserSnapHistory: (state) => {
      state.userSnapHistory = [];
    },

    addUserSubscribed: (state, action) => {
      state.userSubscribed = action.payload;
    },

    toggleUserSubscribe: (state, action) => {
      if (state.userSubscribed?.channels) {
        state.userSubscribed.channels = state.userSubscribed.channels.map(
          (profile) =>
            profile._id === action.payload.profileId
              ? {
                  ...profile,
                  isSubscribed: action.payload.isSubscribed,
                  subscribersCount: action.payload.subscribersCount,
                }
              : profile
        );
      }
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
  addUserVideoHistory,
  removeUserVideoHistory,
  addUserSnapHistory,
  removeUserSnapHistory,
  addUserSubscribed,
  toggleUserSubscribe,
} = userSlice.actions;

export default userSlice.reducer;
