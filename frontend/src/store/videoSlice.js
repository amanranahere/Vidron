import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  video: {
    title: null,
    description: null,
    owner: {
      _id: null,
      username: null,
      fullname: null,
      avatar: null,
      subscribersCount: 0,
    },
  },
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideo: (state, action) => {
      state.video = action.payload;
    },
  },
});

export const { setVideo } = videoSlice.actions;

export default videoSlice.reducer;
