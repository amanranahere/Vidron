import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  snap: null,
};

const snapSlice = createSlice({
  name: "snap",
  initialState,
  reducers: {
    setSnap: (state, action) => {
      state.snap = action.payload;
    },
  },
});

export const { setSnap } = snapSlice.actions;

export default snapSlice.reducer;
