import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'positions',
  initialState: {
    items: {},
    deviceSelected: null,
  },
  reducers: {
    update(state, action) {
      action.payload.forEach(item => state.items[item['deviceId']] = item);
    },
    set(state, action) {
      for (let item in state.items) {
        state.deviceSelected = item === action.payload.id ? state.items[item] : '';
      }
      // state.items.map((oneDevice, index) => oneDevice.deviceId === action.payload.id ? state.deviceSelected = oneDevice : '');
    }
  }
});

export { actions as positionsActions };
export { reducer as positionsReducer };
