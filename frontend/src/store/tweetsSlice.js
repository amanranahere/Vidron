import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tweets: [],
};

const tweetsSlice = createSlice({
  name: "tweets",
  initialState,
  reducers: {
    addTweets: (state, action) => {
      const newTweets = action.payload;
      state.tweets = [
        ...state.tweets,
        ...newTweets.filter(
          (tweet) =>
            !state.tweets.some(
              (existingTweet) => existingTweet._id === tweet._id
            )
        ),
      ];
    },

    deleteTweet: (state, action) => {
      state.tweets = state.tweets.filter(
        (tweets) => tweets._id !== action.payload
      );
    },

    removeTweets: (state) => {
      state.tweets = [];
    },

    updateTweet: (state, action) => {
      state.tweets = state.tweets.map((tweet) =>
        tweet._id === action.payload._id ? action.payload : tweet
      );
    },

    toggleLike: (state, action) => {
      state.tweets = state.tweets.map((tweet) =>
        tweet._id === action.payload.tweetId
          ? {
              ...tweet,
              isLiked: action.payload.isLiked,
              likesCount: action.payload.likesCount,
            }
          : tweet
      );
    },
  },
});

export const { addTweets, deleteTweet, removeTweets, updateTweet, toggleLike } =
  tweetsSlice.actions;

export default tweetsSlice.reducer;
