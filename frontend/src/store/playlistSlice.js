import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  playlist: null,
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    setPlaylist: (state, action) => {
      state.playlist = action.payload;
    },

    updatePlaylist: (state, action) => {
      if (state.playlist) {
        state.playlist = {
          ...state.playlist,
          name: action.payload.name,
          description: action.payload.description,
        };
      }
    },

    removePlaylistVideo: (state, action) => {
      if (state.playlist && Array.isArray(state.playlist.videos)) {
        state.playlist.videos = state.playlist.videos.filter(
          (video) => video._id !== action.payload
        );
      }
    },
  },
});

export const { setPlaylist, updatePlaylist, removePlaylistVideo } =
  playlistSlice.actions;

export default playlistSlice.reducer;
