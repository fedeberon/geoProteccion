import { createSlice } from "@reduxjs/toolkit";

const { reducer, actions } = createSlice({
  name: "session",
  initialState: {
    authenticated: false,
    user: {},
    server: {},
    deviceAttributes: {
      isViewportDesktop: true,
    },
  },
  reducers: {
    authenticated(state, action) {
      state.authenticated = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setServer(state, action) {
      state.server = action.payload;
    },
    setDeviceAttribute(state, action) {
      state.deviceAttributes[action.payload.attribute] = action.payload.value;
    },
  },
});

export { actions as sessionActions };
export { reducer as sessionReducer };
