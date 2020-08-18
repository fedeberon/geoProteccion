import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'modals',
  initialState: {
    items: {
      search: false,
      menu: false,

    }
  },
  reducers: {
    show(state, action) {
      state.items[action.payload] = true
    },
    hide(state, action) {
      state.items[action.payload] = false
    },
  }
});

export { actions as modalsActions };
export { reducer as modalsReducer };
