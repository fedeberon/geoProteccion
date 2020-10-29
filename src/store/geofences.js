import {createSlice} from '@reduxjs/toolkit';

const {reducer, actions} = createSlice({
  name: 'geofences',
  initialState: {
    items: [],
  },
  reducers: {
    add(state, action) {
      if (action.payload.isArray()) {
        action.payload.map((e) => {
          state.items.push(e);
        });
      } else {
        state.items.push(action.payload);
      }
    },
    remove(state, action) {
      delete state.items[action.payload];
    },
  }
});

export {actions as geofencesActions};
export {reducer as geofencesReducer};
