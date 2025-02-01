import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
  subscriptions: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload;
      state.subscriptions = [];
    },

    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
    setSubscriptions: (state, action) => {
      state.subscriptions = Array.isArray(action.payload.channels)
        ? action.payload.channels
        : [];
    },
  },
});

export const { login, logout, setSubscriptions } = authSlice.actions;

export default authSlice.reducer;
