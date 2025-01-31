import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  playlists: [],
};

const playlistsSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    setPlaylists: (state, action) => {
      const newPlaylist = action.payload;
      state.playlists = [
        ...state.playlists,
        ...newPlaylist.filter(
          (playlist) =>
            !state.playlists.some(
              (existingPlaylists) => existingPlaylists._id === playlist._id
            )
        ),
      ];
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
