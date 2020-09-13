import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'session',
  initialState: {
    authenticated: false,
    user: {},
  },
  reducers: {
    authenticated(state, action) {
      state.authenticated = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload
    }
  }
});

export { actions as sessionActions };
export { reducer as sessionReducer };
