import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  playlists: null,
};

const playlistsSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    setPlaylists: (state, action) => {
      state.playlists = action.payload;
    },
    updatePlaylists: (state, action) => {
      if (state.playlists) {
        state.playlists = state.playlists.map((playlist) =>
          playlist._id === action.payload.playlistId
            ? {
                ...playlist,
                isvideoPresent: action.payload.isvideoPresent,
              }
            : playlist
        );
      }
    },
  },
});

export const { setPlaylists, updatePlaylists } = playlistsSlice.actions;

export default playlistsSlice.reducer;
